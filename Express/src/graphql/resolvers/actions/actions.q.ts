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
          assigneeId: user._id,
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

    if (actionQueryInput?.status?.length === 1) {
      pipeline.push({
        $match: {
          status: { $in: actionQueryInput.status },
        },
      });
    }

    if (actionQueryInput?.usersIds?.assigneesIds?.length > 0) {
      pipeline.push({
        $match: {
          assigneeId: { $in: actionQueryInput.usersIds?.assigneesIds },
        },
      });
    }

    // Filter by due date
    if (actionQueryInput?.dueDate) {
      const [filter, startDate, endDate] = actionQueryInput?.dueDate;
      let $match;
      switch (filter) {
        case 'overdue':
          $match = {
            status: 'open',
            dueDate: {
              $lt: new Date(),
            },
          };
          break;
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
      // need to check if he is an area or site owner
      join({
        pipeline,
        collection: 'locations',
        from: 'answer.audit.siteId',
        to: 'answer.audit.site',
      });
      join({
        pipeline,
        collection: 'businessUnits',
        from: 'answer.audit.areaId',
        to: 'answer.audit.area',
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
              'answer.audit.site.ownerId': _id,
            },
            {
              'answer.audit.area.ownerId': _id,
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

    if (shouldJoin(['answer', 'audit', 'site'])) {
      join({
        pipeline,
        collection: 'locations',
        from: 'answer.audit.siteId',
        to: 'answer.audit.site',
      });
    }

    if (shouldJoin(['answer', 'audit', 'area'])) {
      join({
        pipeline,
        collection: 'businessUnits',
        from: 'answer.audit.areaId',
        to: 'answer.audit.area',
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

    if (actionQueryInput?.sitesIds?.length > 0) {
      pipeline.push({
        $match: {
          'answer.audit.siteId': { $in: actionQueryInput.sitesIds },
        },
      });
    }

    if (actionQueryInput?.areasIds?.length > 0) {
      pipeline.push({
        $match: {
          'answer.audit.areaId': { $in: actionQueryInput.areasIds },
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

    return actions.sort((a, b) => priorities[a.priority] - priorities[b.priority]);
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
};

export default actions;
