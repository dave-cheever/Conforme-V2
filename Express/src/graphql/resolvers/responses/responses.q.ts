import {
  addMonths,
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { response } from 'express';
import { GraphQLResolveInfo } from 'graphql';

import { Responses } from 'app-models';
import { doesPathExist, getProjectFields, isPermitted, join } from 'app-utils';

const responses = async (_, { responsesQuery, responsesPagination }, { authorize, organization }, info: GraphQLResolveInfo) => {
  const shouldJoin = (elements: string[]) => doesPathExist(info.fieldNodes, ['responses', 'responses', ...elements]);
  try {
    const { limit = 0, offset = 0, sortBy = 'calculatedStatus', sortDirection = 'asc' } = responsesPagination || {};
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
      responsesQuery?.itemStatus ||
      shouldJoin(['trackerItem']) ||
      shouldJoin(['calculatedStatus']) ||
      sortBy === 'calculatedStatus'
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

    if (responsesQuery?.itemStatus || shouldJoin(['calculatedStatus']) || sortBy === 'calculatedStatus') {
      // Move responses to array
      pipeline.push({
        $group: {
          _id: 'comingUpTriggers',
          responses: {
            $push: "$$ROOT",
          },
        },
      });

      // Lookup coming up trigger settings
      pipeline.push({
        $lookup: {
          from: 'settings',
          localField: '_id',
          foreignField: 'name',
          as: 'comingUpTriggers',
        },
      });

      // Filter coming up trigger settings by organization ID
      pipeline.push({
        $project: {
          responses: "$responses",
          comingUpTriggers: {
            $filter: {
              input: "$comingUpTriggers",
              as: "comingUpTrigger",
              cond: { "$eq": ["$$comingUpTrigger.organizationId", organization._id] },
            },
          },
        },
      });

      // Unwind coming up trigger setting
      pipeline.push({
        $unwind: {
          path: '$comingUpTriggers',
          preserveNullAndEmptyArrays: true,
        },
      });

      // Project to get only values of coming up trigger setting
      pipeline.push({
        $project: {
          responses: "$responses",
          comingUpTriggers: {
            $objectToArray: "$comingUpTriggers.value",
          },
        },
      });

      // Unwind responses
      pipeline.push({
        $unwind: {
          path: '$responses',
        },
      });

      // Push coming up trigger values to responses
      pipeline.push({
        $addFields: {
          'responses.comingUpTriggers': '$comingUpTriggers',
        },
      });

      // Move response to be root of document again
      pipeline.push({
        $replaceRoot: {
          newRoot: '$responses',
        },
      });

      // Take the comming up trigger by tracker item frequency
      pipeline.push({
        $addFields: {
          comingUpTrigger: {
            $arrayElemAt: [{
              $filter: {
                input: "$comingUpTriggers",
                as: "comingUpTrigger",
                cond: {
                  $eq: ["$$comingUpTrigger.k", "$trackerItem.frequency"],
                },
              },
            }, 0],
          },
        },
      });

      // Add isOverdue and isComingUp properties
      pipeline.push({
        $addFields: {
          isOverdue: {
            $and: [{
              $gt: ["$dueDate", null], // dueDate is not null
            }, {
              $lt: ["$dueDate", new Date()], // dueDate is lesser than today
            }],
          },
          isComingUp: {
            $and: [{
              $gt: ["$dueDate", null], // dueDate is not null
            }, {
              $lt: ["$dueDate", {
                $add: [new Date(), { $multiply: ["$comingUpTrigger.v", 24 * 60 * 60 * 1000] }], // dueDate is lesser than today + cumming up trigger for frequency
              }],
            }],
          },
        },
      });

      // Add calculatedStatus property
      pipeline.push({
        $addFields: {
          calculatedStatus: {
            $cond: {
              if: {
                $and: [{
                  $or: [{
                    $eq: ["$status", "submitted"],
                  }, {
                    $and: [{
                      $eq: ["$status", "draft"],
                    }, {
                      $gt: ["$lastCompletionDate", null],
                    }],
                  }],
                }, {
                  $eq: ["$isOverdue", false],
                }],
              },
              then: {
                $cond: {
                  if: {
                    $eq: ["$isComingUp", true],
                  },
                  then: "comingUp",
                  else: "compliant",
                },
              },
              else: "nonCompliant",
            },
          },
        },
      });
    }

    if (responsesQuery?.itemStatus) {
      pipeline.push({
        $match: {
          calculatedStatus: { $in: responsesQuery.itemStatus },
        },
      });
    }

    if (shouldJoin(['responsible'])) {
      join({
        pipeline,
        collection: 'users',
        from: 'responsibleId',
        to: 'responsible',
      });
    }

    // Push all responses to array and count total
    pipeline.push({
      $facet: {
        responses: [{
          $sort: {
            [sortBy]: sortDirection === 'asc' ? 1 : -1,
          },
        }, {
          $limit: (offset || 0) + (limit || 50),
        }, {
          $skip: offset || 0,
        }],
        total: [{
          $count: 'total',
        }],
      },
    });
    pipeline.push({
      $unwind: {
        path: "$total",
      },
    });

    pipeline.push({ $project: getProjectFields(info.fieldNodes, 'responses') });
    const res = (await Responses.aggregate(pipeline))[0];

    return {
      responses: res?.responses || [],
      total: res?.total?.total || 0,
    };
  } catch (err: any) {
    throw new Error(err);
  }
};

export default responses;
