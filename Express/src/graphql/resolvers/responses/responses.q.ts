import {
  addMonths,
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { GraphQLResolveInfo } from 'graphql';
import { PipelineStage } from 'mongoose';

import { Responses } from 'app-models';
import { doesPathExist, getProjectFields, isPermitted, join } from 'app-utils';
import { flatten } from 'lodash';

// There is a set of pre-defined filters that are passed in responsesQuery object:
// _id, trackerItemsIds, regulatoryBodiesIds, categoriesIds, businessUnitsIds, locationsIds, usersIds, dueDate, itemStatus, includeNotPublished
// All the rest are filters from dynamic questions defined in tracker item
const responses = async (_, { responsesQuery, responsesPagination }, { authorize, organization }, info: GraphQLResolveInfo) => {
  const shouldJoin = (elements: string[]) => doesPathExist(info.fieldNodes, ['responses', 'responses', ...elements]);
  try {
    const { limit = 0, offset = 0, sortBy = 'calculatedStatus', sortDirection = 'asc' } = responsesPagination || {};
    const user = await authorize();
    const pipeline: PipelineStage[] = [
      {
        $match: {
          organizationId: organization._id,
        },
      },
    ];

    if (!isPermitted({ user, action: 'responses.viewAll' })) {
      pipeline.push({
        $match: {
          $or: [
            { accountableId: user.userId },
            { responsibleId: user.userId },
            { contributorsIds: { $in: [user.userId] } },
            { followersIds: { $in: [user.userId] } },
          ],
        },
      });
    }

    const { _id, trackerItemsIds, regulatoryBodiesIds, categoriesIds, businessUnitsIds, locationsIds,
      usersIds, dueDate, itemStatus, status, includeNotPublished, ...questionsQuery } = responsesQuery || {};

    // Filter by response id
    if (_id) {
      pipeline.push({
        $match: {
          _id,
        },
      });
    }

    // Filter by tracker item id
    if (trackerItemsIds) {
      pipeline.push({
        $match: {
          trackerItemId: { $in: trackerItemsIds },
        },
      });
    }

    // Filter by business unit id
    if (businessUnitsIds) {
      pipeline.push({
        $match: {
          businessUnitId: { $in: businessUnitsIds },
        },
      });
    }

    // Filter by due date
    if (dueDate) {
      const [filter, startDate, endDate] = dueDate;
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
    if (!(includeNotPublished && isPermitted({ user, action: 'responses.viewAll' }))) {
      pipeline.push({
        $match: {
          published: true,
        },
      });
    }

    // Join tracker item
    if (
      // Need to get Tracker Item if there are any dependant filters
      includeNotPublished ||
      categoriesIds ||
      regulatoryBodiesIds ||
      itemStatus ||
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
    if (categoriesIds) {
      pipeline.push({
        $match: {
          'trackerItem.categoryId': { $in: categoriesIds },
        },
      });
    }

    // Filter by location id (in tracker item)
    if (locationsIds) {
      pipeline.push({
        $match: {
          'trackerItem.locationsIds': { $in: locationsIds },
        },
      });
    }

    // Filter by user id (in tracker item)
    if (usersIds) {
      const conds: any = [];
      if (usersIds.responsibleIds?.length > 0) {
        conds.push({
          responsibleId: { $in: usersIds.responsibleIds },
        });
      }
      if (usersIds.accountableIds?.length > 0) {
        conds.push({
          accountableId: { $in: usersIds.accountableIds },
        });
      }
      if (usersIds.contributorIds?.length > 0) {
        conds.push({
          contributorsIds: { $in: usersIds.contributorIds },
        });
      }
      if (usersIds.followerIds?.length > 0) {
        conds.push({
          followersIds: { $in: usersIds.followerIds },
        });
      }
      pipeline.push({
        $match: {
          $and: conds,
        },
      });
    }

    // Filter by regulatory body id (in tracker item)
    if (regulatoryBodiesIds) {
      pipeline.push({
        $match: {
          'trackerItem.regulatoryBodyId': {
            $in: regulatoryBodiesIds,
          },
        },
      });
    }

    // Filter by custom questions
    if (Object.keys(questionsQuery).length > 0) {
      Object.entries(questionsQuery as { [questionName: string]: string[] }).forEach(([questionName, values]) => {
        const questionsOr = flatten(values.map((value) => [
          {
            "questions.name": questionName,
            "questions.value": {
              label: value,
              isCorrect: true,
            },
          },
          {
            "questions.name": questionName,
            "questions.value": value,
          },
        ]));
        pipeline.push({
          $match: {
            $or: questionsOr,
          },
        });
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

    if (shouldJoin(['trackerItem', 'locations'])) {
      pipeline.push({
        $lookup: {
          from: 'locations',
          localField: 'trackerItem.locationsIds',
          foreignField: '_id',
          as: 'trackerItem.locations',
        },
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

    if (itemStatus || shouldJoin(['calculatedStatus']) || sortBy === 'calculatedStatus') {
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

    if (itemStatus) {
      pipeline.push({
        $match: {
          calculatedStatus: { $in: itemStatus },
        },
      });
    }

    if (status) {
      pipeline.push({
        $match: {
          status: { $in: status },
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
    if (shouldJoin(['contributors'])) {
      join({
        pipeline,
        collection: 'users',
        from: 'contributorsIds',
        to: 'contributors',
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

    pipeline.push({
      $project: {
        ...getProjectFields(info.fieldNodes, 'responses'), contributors: {
          displayName: 1,
          imgUrl: 1
        }
      }
    });
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
