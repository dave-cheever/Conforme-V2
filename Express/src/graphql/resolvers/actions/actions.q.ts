import { addMonths, endOfDay, endOfMonth, endOfWeek, endOfYear, startOfDay, startOfMonth, startOfWeek, startOfYear } from 'date-fns';
import { GraphQLResolveInfo } from 'graphql';

import { Actions, AuditLogs, Users } from 'app-models';
import { doesPathExist, getProjectFields, isPermitted, join, priorities } from 'app-utils';

const actions = async (_, { actionQueryInput }, { authorize, organization }, info: GraphQLResolveInfo) => {
  const shouldJoin = (elements: string[]) => doesPathExist(info.fieldNodes, ['actions', ...elements]);
  try {
    const user = await authorize();
    const pipeline: any[] = [
      {
        $match: {
          'metatags.removedAt': { $eq: null },
          organizationId: organization._id,
        },
      },
    ];

    if (!isPermitted({ user, action: 'actions.viewAll' })) {
      pipeline.push({
        $match: {
          $and: [
            {
              $or: [{ assigneeId: user?._id }, { 'metatags.addedBy': user?._id }],
            },
          ],
        },
      });
    }

    if (actionQueryInput?._id) {
      pipeline.push({
        $match: {
          _id: actionQueryInput._id,
        },
      });
    }

    if (actionQueryInput?.scope) {
      pipeline.push({
        $match: Object.entries(actionQueryInput.scope).reduce((acc, [key, value]) => {
          acc[`scope.${key}`] = value;
          return acc;
        }, {}),
      });
    }

    if (actionQueryInput?.status?.length > 0) {
      const statusQueries = actionQueryInput.status.map((status) => {
        if (status === 'overdue') {
          return {
            status: 'open',
            dueDate: {
              $lt: new Date(),
            },
          };
        }
        return {
          status,
        };
      });
      pipeline.push({
        $match: {
          $or: statusQueries,
        },
      });
    }

    if (actionQueryInput?.priority?.length > 0) {
      pipeline.push({
        $match: {
          priority: { $in: actionQueryInput.priority },
        },
      });
    }

    if (actionQueryInput?.usersIds?.assigneesIds?.length > 0) {
      pipeline.push({
        $match: {
          assigneeId: {
            $in: actionQueryInput.usersIds?.assigneesIds?.map((assigneeId: string) => (assigneeId === 'unassigned' ? null : assigneeId)),
          },
        },
      });
    }

    // Filter by due date
    if (actionQueryInput?.dueDate) {
      const [filter, startDate, endDate] = actionQueryInput?.dueDate;
      let $match;
      switch (filter) {
        case 'thisWeek':
          $match = {
            $and: [
              {
                dueDate: {
                  $gte: startOfWeek(new Date(), { weekStartsOn: 1 }),
                },
              },
              {
                dueDate: {
                  $lte: endOfWeek(new Date(), { weekStartsOn: 1 }),
                },
              },
            ],
          };
          break;
        case 'thisMonth':
          $match = {
            $and: [
              {
                dueDate: {
                  $gte: startOfMonth(new Date()),
                },
              },
              {
                dueDate: {
                  $lte: endOfMonth(new Date()),
                },
              },
            ],
          };
          break;
        case 'thisYear':
        case 'allMonths':
          $match = {
            $and: [
              {
                dueDate: {
                  $gte: startOfYear(new Date()),
                },
              },
              {
                dueDate: {
                  $lte: endOfYear(new Date()),
                },
              },
            ],
          };
          break;
        case 'nextMonth':
          $match = {
            $and: [
              {
                dueDate: {
                  $gte: startOfMonth(addMonths(new Date(), 1)),
                },
              },
              {
                dueDate: {
                  $lte: endOfMonth(addMonths(new Date(), 1)),
                },
              },
            ],
          };
          break;
        case 'exactDate':
          $match = {
            $and: [
              {
                dueDate: {
                  $gte: startOfDay(new Date(startDate)),
                },
              },
              {
                dueDate: {
                  $lte: endOfDay(new Date(startDate)),
                },
              },
            ],
          };
          break;
        case 'dateRange':
          if (startDate && endDate) {
            $match = {
              $and: [
                {
                  dueDate: {
                    $gte: startOfDay(new Date(startDate)),
                  },
                },
                {
                  dueDate: {
                    $lte: endOfDay(new Date(endDate)),
                  },
                },
              ],
            };
          }
          break;
        case 'overdue':
          $match = { dueDate: { $lt: new Date() } };
          break;
        default:
          break;
      }

      if ($match) pipeline.push({ $match });
    }

    if (shouldJoin(['answer']) || !isPermitted({ user, action: 'actions.viewAll' })) {
      join({
        pipeline,
        collection: 'answers',
        from: 'scope._id',
        to: 'answer',
      });
    }

    if (shouldJoin(['answer', 'audit']) || !isPermitted({ user, action: 'actions.viewAll' })) {
      join({
        pipeline,
        collection: 'audits',
        from: 'answer.scope._id',
        to: 'answer.audit',
      });
    }

    // For "user" role filter actions
    if (!isPermitted({ user, action: 'actions.viewAll' })) {
      // If user doesn't have permissions to get all actions
      // need to check if he is an businessUnit or location owner
      join({
        pipeline,
        collection: 'locations',
        from: 'answer.audit.locationId',
        to: 'answer.audit.location',
      });
      join({
        pipeline,
        collection: 'businessUnits',
        from: 'answer.audit.businessUnitId',
        to: 'answer.audit.businessUnit',
      });

      /**
       * User's direct reports. The user is a manager of these users.
       */
      const users = await Users.customFindWithDetails({ selector: { managerId: user._id }, organization });

      /**
       * Array of all users including the user himself and his direct reports
       */
      const userIds = [user._id, ...users.map((user) => user._id)];

      const $or: { [key: string]: string }[] = [];
      userIds.forEach((_id) => {
        $or.push(
          ...[
            {
              'answer.audit.auditorId': _id,
            },
            {
              'answer.audit.participantsIds': _id,
            },
            {
              'answer.audit.location.ownerId': _id,
            },
            {
              'answer.audit.businessUnit.ownerId': _id,
            },
            {
              assigneeId: _id,
            },
          ],
        );
      });

      pipeline.push({
        $match: {
          $or,
        },
      });
    }

    if (shouldJoin(['answer', 'audit', 'auditType'])) {
      join({
        pipeline,
        collection: 'auditTypes',
        from: 'answer.audit.auditTypeId',
        to: 'answer.audit.auditType',
      });
    }

    if (shouldJoin(['answer', 'audit', 'location'])) {
      join({
        pipeline,
        collection: 'locations',
        from: 'answer.audit.locationId',
        to: 'answer.audit.location',
      });
    }

    if (shouldJoin(['answer', 'audit', 'businessUnit'])) {
      join({
        pipeline,
        collection: 'businessUnits',
        from: 'answer.audit.businessUnitId',
        to: 'answer.audit.businessUnit',
      });
    }

    if (shouldJoin(['answer', 'question'])) {
      join({
        pipeline,
        collection: 'questions',
        from: 'answer.questionId',
        to: 'answer.question',
      });
    }

    if (shouldJoin(['answer', 'businessUnit'])) {
      join({
        pipeline,
        collection: 'businessUnits',
        from: 'answer.businessUnitId',
        to: 'answer.businessUnit',
      });
    }

    if (actionQueryInput?.locationsIds?.length > 0) {
      pipeline.push({
        $match: {
          'answer.audit.locationId': { $in: actionQueryInput.locationsIds },
        },
      });
    }

    if (actionQueryInput?.businessUnitsIds?.length > 0) {
      pipeline.push({
        $match: {
          $or: [
            { 'answer.audit.businessUnitId': { $in: actionQueryInput.businessUnitsIds } },
            { 'answer.businessUnitId': { $in: actionQueryInput.businessUnitsIds } },
          ],
        },
      });
    }

    pipeline.push({ $project: getProjectFields(info.fieldNodes, 'actions') });
    let actions = await Actions.aggregate(pipeline);

    if (shouldJoin(['assignee'])) {
      actions = await Promise.all(
        actions.map(async (action) => {
          if (!action.assigneeId) return action;
          try {
            return {
              ...action,
              assignee: await Users.customFindByIdWithDetails({
                userId: action?.assigneeId,
                organization,
              }),
            };
          } catch (e) {
            console.log(`Error occured for action with ID ${action._id}: ${e}`);
            return action;
          }
        }),
      );
    }

    if (shouldJoin(['assignor'])) {
      actions = await Promise.all(
        actions.map(async (action) => {
          try {
            const latestAssociatedAuditLog = await AuditLogs.aggregate([
              {
                $match: { organizationId: organization._id, 'element._id': action._id, 'values.assigneeId.new': { $ne: null } },
              },
            ]);
            const assignorId = latestAssociatedAuditLog[0]?.metatags.addedBy;

            return {
              ...action,
              assignor: await Users.customFindByIdWithDetails({
                userId: assignorId ?? action.metatags.addedBy,
                organization,
              }),
            };
          } catch (e) {
            console.log(`Error occured for action with ID ${action._id}: ${e}`);
            return action;
          }
        }),
      );
    }

    if (shouldJoin(['creator'])) {
      actions = await Promise.all(
        actions.map(async (action) => {
          try {
            return {
              ...action,
              creator: await Users.customFindByIdWithDetails({
                userId: action.metatags.addedBy,
                organization,
              }),
            };
          } catch (e) {
            console.log(`Error occured for action with ID ${action._id}: ${e}`);
            return action;
          }
        }),
      );
    }

    return actions.sort((a, b) => priorities[a.priority] - priorities[b.priority]);
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
};

export default actions;
