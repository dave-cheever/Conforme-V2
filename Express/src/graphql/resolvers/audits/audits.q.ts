import {
  addMonths,
  compareDesc,
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subYears,
} from 'date-fns';
import { GraphQLResolveInfo } from 'graphql';
import { PipelineStage } from 'mongoose';

import { IUser } from 'app-interfaces';
import { Audits, Users } from 'app-models';
import { doesPathExist, getProjectFields, isPermitted, join } from 'app-utils';

const audits = async (_, { auditQueryInput }, { authorize, organization }, info: GraphQLResolveInfo) => {
  const shouldJoin = (elements: string[]) => doesPathExist(info.fieldNodes, ['audits', ...elements]);
  try {
    const user = await authorize();
    const pipeline: PipelineStage[] = [
      {
        $match: {
          'metatags.removedAt': auditQueryInput?.showArchived ? { $exists: true } : { $eq: null },
          organizationId: organization._id,
        },
      },
    ];
    if (shouldJoin(['location']) || !isPermitted({ user, action: 'audits.viewAll' })) {
      join({
        pipeline,
        collection: 'locations',
        from: 'locationId',
        to: 'location',
      });
    }

    if (shouldJoin(['businessUnit']) || !isPermitted({ user, action: 'audits.viewAll' })) {
      join({
        pipeline,
        collection: 'businessUnits',
        from: 'businessUnitId',
        to: 'businessUnit',
      });
    }

    // For "user" role filter audits
    if (!isPermitted({ user, action: 'audits.viewAll' })) {
      /**
       * User's direct reports. The user is a manager of these users.
       */
      const users = await Users.customFindWithDetails({ selector: { managerId: user.userId }, organization });

      /**
       * Array of all users including the user himself and his direct reports
       */
      const userIds = [user.userId, ...users.map((user) => user.userId)];

      const $or: { [key: string]: string }[] = [];
      userIds.forEach((_id) => {
        $or.push(
          ...[
            {
              auditorId: _id,
            },
            {
              participantsIds: _id,
            },
            {
              'location.ownerId': _id,
            },
            {
              'businessUnit.ownerId': _id,
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

    if (auditQueryInput?._id) {
      pipeline.push({
        $match: {
          _id: auditQueryInput._id,
        },
      });
    }

    if (auditQueryInput?.walkType?.length > 0) {
      pipeline.push({
        $match: {
          walkType: { $in: auditQueryInput.walkType },
        },
      });
    }

    if (auditQueryInput?.auditTypesIds?.length > 0) {
      pipeline.push({
        $match: {
          auditTypeId: { $in: auditQueryInput.auditTypesIds },
        },
      });
    }

    if (auditQueryInput?.locationsIds?.length > 0) {
      pipeline.push({
        $match: {
          locationId: { $in: auditQueryInput.locationsIds },
        },
      });
    }

    if (auditQueryInput?.businessUnitsIds?.length > 0) {
      pipeline.push({
        $lookup: {
          from: 'answers',
          localField: '_id',
          foreignField: 'scope._id',
          as: 'answers',
        },
      })

      pipeline.push({
        $match: {
          $or: [{ businessUnitId: { $in: auditQueryInput.businessUnitsIds } }, { 'answers.businessUnitId': { $in: auditQueryInput.businessUnitsIds } }],
        },
      });
    }

    if (auditQueryInput?.usersIds?.auditorsIds?.length > 0) {
      pipeline.push({
        $match: {
          auditorId: { $in: auditQueryInput.usersIds?.auditorsIds },
        },
      });
    }

    if (auditQueryInput?.usersIds?.participantsIds?.length > 0) {
      pipeline.push({
        $match: {
          participantsIds: {
            $in: auditQueryInput.usersIds?.participantsIds,
          },
        },
      });
    }

    if (auditQueryInput?.status?.length > 0) {
      pipeline.push({
        $match: {
          status: {
            $in: auditQueryInput.status,
          },
        },
      });
    }

    // Filter by created date or due date
    // Based on query parameter
    // Audits attribute selected conditionally to filter
    if (auditQueryInput?.createdDate || auditQueryInput?.dueDate) {
      const [filter, startDate, endDate] = auditQueryInput?.createdDate || auditQueryInput?.dueDate;
      const filterByCreatedDate = !!auditQueryInput.createdDate;
      let $match;
      switch (filter) {
        case 'thisWeek':
          $match = {
            $and: [
              {
                [filterByCreatedDate ? 'metatags.addedAt' : 'dueDate']: {
                  $gte: startOfWeek(new Date(), { weekStartsOn: 1 }),
                },
              },
              {
                [filterByCreatedDate ? 'metatags.addedAt' : 'dueDate']: {
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
                [filterByCreatedDate ? 'metatags.addedAt' : 'dueDate']: {
                  $gte: startOfMonth(new Date()),
                },
              },
              {
                [filterByCreatedDate ? 'metatags.addedAt' : 'dueDate']: {
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
                [filterByCreatedDate ? 'metatags.addedAt' : 'dueDate']: {
                  $gte: startOfYear(new Date()),
                },
              },
              {
                [filterByCreatedDate ? 'metatags.addedAt' : 'dueDate']: {
                  $lte: endOfYear(new Date()),
                },
              },
            ],
          };
          break;
        case 'last12Months':
          $match = {
            $and: [
              {
                [filterByCreatedDate ? 'metatags.addedAt' : 'dueDate']: {
                  $gte: startOfMonth(addMonths(subYears(new Date(), 1), 1)),
                },
              },
              {
                [filterByCreatedDate ? 'metatags.addedAt' : 'dueDate']: {
                  $lte: endOfMonth(new Date()),
                },
              },
            ],
          };
          break;
        case 'nextMonth':
          $match = {
            $and: [
              {
                [filterByCreatedDate ? 'metatags.addedAt' : 'dueDate']: {
                  $gte: startOfMonth(addMonths(new Date(), 1)),
                },
              },
              {
                [filterByCreatedDate ? 'metatags.addedAt' : 'dueDate']: {
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
                [filterByCreatedDate ? 'metatags.addedAt' : 'dueDate']: {
                  $gte: startOfDay(new Date(startDate)),
                },
              },
              {
                [filterByCreatedDate ? 'metatags.addedAt' : 'dueDate']: {
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
                  [filterByCreatedDate ? 'metatags.addedAt' : 'dueDate']: {
                    $gte: startOfDay(new Date(startDate)),
                  },
                },
                {
                  [filterByCreatedDate ? 'metatags.addedAt' : 'dueDate']: {
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

    if (shouldJoin(['auditType'])) {
      join({
        pipeline,
        collection: 'auditTypes',
        from: 'auditTypeId',
        to: 'auditType',
      });
    }

    if (shouldJoin(['questions'])) {
      pipeline.push({
        $lookup: {
          from: 'questions',
          localField: '_id',
          foreignField: 'scope._id',
          as: 'questions',
        },
      });
    }

    pipeline.push({
      $project: {
        auditorId: shouldJoin(['auditor']),
        participantsIds: shouldJoin(['participants']),
        ...getProjectFields(info.fieldNodes, 'audits'),
        metatags: 1,
      },
    });

    if (shouldJoin(['numberOfActions'])) {
      pipeline.push({
        $lookup: {
          from: 'answers',
          localField: '_id',
          foreignField: 'scope._id',
          as: 'answers',
        },
      });
      pipeline.push({
        $lookup: {
          from: 'actions',
          localField: 'answers._id',
          foreignField: 'scope._id',
          as: 'actions',
        },
      });
      pipeline.push({
        $project: {
          auditorId: shouldJoin(['auditor']),
          participantsIds: shouldJoin(['participants']),
          ...getProjectFields(info.fieldNodes, 'audits'),
          metatags: 1,
          actions: 1,
        },
      });
    }

    let audits = await Audits.aggregate(pipeline);

    if (shouldJoin(['auditor']) || shouldJoin(['participants'])) {
      audits = await Promise.all(
        audits.map(async (audit) => {
          try {
            let auditor;
            let participants: IUser[] = [];
            if (shouldJoin(['auditor'])) {
              auditor = await Users.customFindByIdWithDetails({
                userId: audit.auditorId,
                organization,
              });
            }
            if (shouldJoin(['participants']) && audit.participantsIds && audit.participantsIds.length > 0)
              participants = await Users.customFindWithDetails({ selector: { _id: { $in: audit.participantsIds } }, organization });

            return {
              ...audit,
              auditor,
              participants,
            };
          } catch (e) {
            console.log(`Error occured for audit with ID ${audit._id}: ${e}`);
            return audit;
          }
        }),
      );
    }

    if (shouldJoin(['numberOfActions'])) {
      audits = audits.map((audit) => ({
        ...audit,
        numberOfActions: audit.actions?.filter((action) => !action.metatags.removedAt)?.length ?? 0,
      }));
    }

    return audits.sort((a, b) => compareDesc(new Date(a.metatags.addedAt), new Date(b.metatags.addedAt)));
  } catch (err: any) {
    throw new Error(err);
  }
};

export default audits;
