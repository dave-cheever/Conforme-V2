import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  endOfDay,
  endOfMonth,
  endOfWeek,
  isAfter,
  isSameDay,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { response } from 'express';
import { GraphQLResolveInfo } from 'graphql';

import { Responses, Settings, Users } from 'app-models';
import { doesPathExist, getProjectFields, isPermitted, join } from 'app-utils';

const responses = async (_, { responsesQuery }, { authorize, organization }, info: GraphQLResolveInfo) => {
  const shouldJoin = (elements: string[]) => doesPathExist(info.fieldNodes, ['responses', ...elements]);
  try {
    const user = await authorize();
    const pipeline: any[] = [
      {
        $match: {
          organizationId: organization._id,
        },
      },
    ];

    if (!isPermitted({ user, action: 'responses.viewAll', data: { response } })) {
      pipeline.push({
        $match: {
          $or: [
            { accountableId: user._id },
            { responsibleId: user._id },
            { contributorsIds: { $in: [user._id] } },
            { followersIds: { $in: [user._id] } },
          ],
        },
      });
    }

    // Filter by response id
    if (responsesQuery?._id) {
      pipeline.push({
        $match: {
          _id: responsesQuery._id,
        },
      });
    }

    // Filter by tracker item id
    if (responsesQuery?.trackerItemsIds) {
      pipeline.push({
        $match: {
          trackerItemId: { $in: responsesQuery.trackerItemsIds },
        },
      });
    }

    // Filter by business unit id
    if (responsesQuery?.businessUnitsIds) {
      pipeline.push({
        $match: {
          businessUnitId: { $in: responsesQuery.businessUnitsIds },
        },
      });
    }

    // Filter by due date
    if (responsesQuery?.dueDate) {
      const [filter, startDate, endDate] = responsesQuery?.dueDate;
      let $match;
      switch (filter) {
        case 'noDueDate':
          $match = {
            dueDate: {
              $eq: null,
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

    // Filter by published state
    if (!(responsesQuery?.includeNotPublished && isPermitted({ user, action: 'responses.viewAll' }))) {
      pipeline.push({
        $match: {
          published: true,
        },
      });
    }

    // Join tracker item
    if (
      // Need to get Tracker Item if there are any dependant filters
      responsesQuery?.includeNotPublished ||
      responsesQuery?.categoriesIds ||
      responsesQuery?.regulatoryBodiesIds ||
      shouldJoin(['trackerItem']) ||
      shouldJoin(['calculatedStatus'])
    ) {
      join({
        pipeline,
        collection: 'trackerItems',
        from: 'trackerItemId',
        to: 'trackerItem',
      });
    }

    // Filter by category id (in tracker item)
    if (responsesQuery?.categoriesIds) {
      pipeline.push({
        $match: {
          'trackerItem.categoryId': { $in: responsesQuery.categoriesIds },
        },
      });
    }

    // Filter by location id (in tracker item)
    if (responsesQuery?.locationsIds) {
      pipeline.push({
        $match: {
          'trackerItem.locationsIds': { $in: responsesQuery.locationsIds },
        },
      });
    }

    // Filter by user id (in tracker item)
    if (responsesQuery?.usersIds) {
      const conds: any = [];
      if (responsesQuery?.usersIds.responsibleIds?.length > 0) {
        conds.push({
          responsibleId: { $in: responsesQuery.usersIds.responsibleIds },
        });
      }
      if (responsesQuery?.usersIds.accountableIds?.length > 0) {
        conds.push({
          accountableId: { $in: responsesQuery.usersIds.accountableIds },
        });
      }
      if (responsesQuery?.usersIds.contributorIds?.length > 0) {
        conds.push({
          contributorsIds: { $in: responsesQuery.usersIds.contributorIds },
        });
      }
      if (responsesQuery?.usersIds.followerIds?.length > 0) {
        conds.push({
          followersIds: { $in: responsesQuery.usersIds.followerIds },
        });
      }
      pipeline.push({
        $match: {
          $and: conds,
        },
      });
    }

    // Filter by regulatory body id (in tracker item)
    if (responsesQuery?.regulatoryBodiesIds) {
      pipeline.push({
        $match: {
          'trackerItem.regulatoryBodyId': {
            $in: responsesQuery.regulatoryBodiesIds,
          },
        },
      });
    }

    // Join category
    if (shouldJoin(['trackerItem', 'category'])) {
      join({
        pipeline,
        collection: 'categories',
        from: 'trackerItem.categoryId',
        to: 'trackerItem.category',
      });
    }

    // Join regulatory body
    if (shouldJoin(['trackerItem', 'regulatoryBody'])) {
      join({
        pipeline,
        collection: 'regulatoryBodies',
        from: 'trackerItem.regulatoryBodyId',
        to: 'trackerItem.regulatoryBody',
      });
    }

    // Join business unit
    if (shouldJoin(['businessUnit'])) {
      join({
        pipeline,
        collection: 'businessUnits',
        from: 'businessUnitId',
        to: 'businessUnit',
      });
    }

    pipeline.push({ $project: getProjectFields(info.fieldNodes, 'responses') });

    const responses = await Responses.aggregate(pipeline);

    // Join responsible
    if (shouldJoin(['responsible'])) {
      await Promise.all(
        responses.map(async (response) => {
          try {
            response.responsible = await Users.customFindByIdWithDetails({
              userId: response.responsibleId,
              organization,
            });
          } catch (e) {
            console.log(`Error occured for response with ID ${response._id}: ${e}`);
          }
        }),
      );
    }

    if (shouldJoin(['daysToDueDate'])) {
      for (const response of responses) {
        if (!response.dueDate) continue;

        const start = new Date(response.dueDate);
        const end = new Date();
        if (isSameDay(start, end)) response.daysToDueDate = 0;
        else response.daysToDueDate = differenceInCalendarDays(start, end);
      }
    }

    if (shouldJoin(['calculatedStatus'])) {
      const comingUpTriggersSetting = await Settings.customFindByName(
        'comingUpTriggers',
        organization._id,
      );
      const triggers = comingUpTriggersSetting?.[0]?.value;
      for (const response of responses) {
        const daysToComingUp = triggers[response.trackerItem.frequency]
        const isOverdue = response.dueDate ? isAfter(new Date(), new Date(response.dueDate)) : false;
        const isComingUp = response.dueDate ? isAfter(addDays(new Date(), daysToComingUp), new Date(response.dueDate)) : false;
        if (
          (
            response.status === 'submitted' ||
            (response.status === 'draft' && response.lastCompletionDate)
          ) &&
          !isOverdue
        ) response.calculatedStatus = isComingUp ? 'comingUp' : 'compliant';
        else response.calculatedStatus = 'nonCompliant';
      }
    }

    return responses;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default responses;
