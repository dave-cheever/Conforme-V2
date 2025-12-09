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

const addPermissionFilter = (pipeline: PipelineStage[], user: any): void => {
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
};

const addBasicFilters = (pipeline: PipelineStage[], _id: any, trackerItemsIds: any, businessUnitsIds: any): void => {
  if (_id) {
    pipeline.push({
      $match: {
        _id,
      },
    });
  }

  if (trackerItemsIds) {
    pipeline.push({
      $match: {
        trackerItemId: { $in: trackerItemsIds },
      },
    });
  }

  if (businessUnitsIds) {
    pipeline.push({
      $match: {
        businessUnitId: { $in: businessUnitsIds },
      },
    });
  }
};

const buildDueDateMatch = (filter: string, startDate?: string, endDate?: string): any => {
  switch (filter) {
    case 'noDueDate':
      return {
        dueDate: {
          $eq: null,
        },
      };
    case 'thisWeek':
      return {
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
    case 'thisMonth':
      return {
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
    case 'nextMonth':
      return {
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
    case 'exactDate':
      return {
        $and: [
          {
            dueDate: {
              $gte: startOfDay(new Date(startDate!)),
            },
          },
          {
            dueDate: {
              $lte: endOfDay(new Date(startDate!)),
            },
          },
        ],
      };
    case 'dateRange':
      if (startDate && endDate) {
        return {
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
      return null;
    default:
      return null;
  }
};

const addDueDateFilter = (pipeline: PipelineStage[], dueDate: any): void => {
  if (!dueDate) return;

  const [filter, startDate, endDate] = dueDate;
  const dueDateMatch = buildDueDateMatch(filter, startDate, endDate);
  if (dueDateMatch) {
    pipeline.push({ $match: dueDateMatch });
  }
};

const addPublishedFilter = (pipeline: PipelineStage[], user: any, includeNotPublished: boolean): void => {
  if (!(includeNotPublished && isPermitted({ user, action: 'responses.viewAll' }))) {
    pipeline.push({
      $match: {
        published: true,
      },
    });
  }
};

const shouldJoinTrackerItem = (
  includeNotPublished: boolean,
  categoriesIds: any,
  regulatoryBodiesIds: any,
  itemStatus: any,
  searchText: string | undefined,
  shouldJoin: (elements: string[]) => boolean,
  sortBy: string
): boolean => {
  return (
    includeNotPublished ||
    categoriesIds ||
    regulatoryBodiesIds ||
    itemStatus ||
    searchText ||
    shouldJoin(['trackerItem']) ||
    shouldJoin(['calculatedStatus']) ||
    sortBy === 'calculatedStatus'
  );
};

const addCategoryAndLocationFilters = (pipeline: PipelineStage[], categoriesIds: any, locationsIds: any): void => {
  if (categoriesIds) {
    pipeline.push({
      $match: {
        'trackerItem.categoryId': { $in: categoriesIds },
      },
    });
  }

  if (locationsIds) {
    pipeline.push({
      $match: {
        'trackerItem.locationsIds': { $in: locationsIds },
      },
    });
  }
};

const addUserFilters = (pipeline: PipelineStage[], usersIds: any): void => {
  if (!usersIds) return;

  const userConditions: any = [];
  if (usersIds.responsibleIds?.length > 0) {
    userConditions.push({
      responsibleId: { $in: usersIds.responsibleIds },
    });
  }
  if (usersIds.accountableIds?.length > 0) {
    userConditions.push({
      accountableId: { $in: usersIds.accountableIds },
    });
  }
  if (usersIds.contributorIds?.length > 0) {
    userConditions.push({
      contributorsIds: { $in: usersIds.contributorIds },
    });
  }
  if (usersIds.followerIds?.length > 0) {
    userConditions.push({
      followersIds: { $in: usersIds.followerIds },
    });
  }

  if (userConditions.length > 0) {
    pipeline.push({
      $match: {
        $and: userConditions,
      },
    });
  }
};

const addRegulatoryBodyFilter = (pipeline: PipelineStage[], regulatoryBodiesIds: any): void => {
  if (regulatoryBodiesIds) {
    pipeline.push({
      $match: {
        'trackerItem.regulatoryBodyId': {
          $in: regulatoryBodiesIds,
        },
      },
    });
  }
};

const addCustomQuestionsFilter = (pipeline: PipelineStage[], questionsQuery: any): void => {
  if (Object.keys(questionsQuery).length === 0) return;

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
};

const addRelatedJoins = (
  pipeline: PipelineStage[],
  shouldJoin: (elements: string[]) => boolean,
  searchText: string | undefined
): void => {
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

  if (shouldJoin(['trackerItem', 'regulatoryBody'])) {
    join({
      pipeline,
      collection: 'regulatoryBodies',
      from: 'trackerItem.regulatoryBodyId',
      to: 'trackerItem.regulatoryBody',
    });
  }

  if (searchText || shouldJoin(['businessUnit'])) {
    join({
      pipeline,
      collection: 'businessUnits',
      from: 'businessUnitId',
      to: 'businessUnit',
    });
  }
};

const addCalculatedStatusPipeline = (pipeline: PipelineStage[], organization: any): void => {
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
};

const addStatusFilters = (pipeline: PipelineStage[], itemStatus: any, status: any): void => {
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
};

const addResponsibleJoin = (pipeline: PipelineStage[]): void => {
  pipeline.push({
    $addFields: {
      hasValidResponsibleId: {
        $and: [{ $ne: ['$responsibleId', null] }, { $ne: ['$responsibleId', ''] }],
      },
    },
  });

  pipeline.push({
    $lookup: {
      from: 'users',
      localField: 'responsibleId',
      foreignField: 'userId',
      as: 'responsible',
    },
  });

  pipeline.push({
    $unwind: {
      path: '$responsible',
      preserveNullAndEmptyArrays: true,
    },
  });

  pipeline.push({
    $addFields: {
      responsible: {
        $cond: {
          if: '$hasValidResponsibleId',
          then: '$responsible',
          else: null,
        },
      },
    },
  });

  pipeline.push({
    $project: {
      hasValidResponsibleId: 0,
    },
  });
};

const addContributorsJoin = (pipeline: PipelineStage[]): void => {
  pipeline.push({
    $addFields: {
      hasValidContributorsIds: {
        $and: [{ $ne: ['$contributorsIds', null] }, { $gt: [{ $size: '$contributorsIds' }, 0] }],
      },
    },
  });

  pipeline.push({
    $lookup: {
      from: 'users',
      localField: 'contributorsIds',
      foreignField: 'userId',
      as: 'contributors',
    },
  });

  pipeline.push({
    $addFields: {
      contributors: {
        $cond: {
          if: '$hasValidContributorsIds',
          then: '$contributors',
          else: [],
        },
      },
    },
  });

  pipeline.push({
    $project: {
      hasValidContributorsIds: 0,
    },
  });
};

const addUserJoins = (
  pipeline: PipelineStage[],
  searchText: string | undefined,
  shouldJoin: (elements: string[]) => boolean
): void => {
  if (searchText || shouldJoin(['responsible'])) {
    addResponsibleJoin(pipeline);
  }

  if (shouldJoin(['contributors'])) {
    addContributorsJoin(pipeline);
  }
};

const addSearchTextFilter = (pipeline: PipelineStage[], searchText: string | undefined): void => {
  if (!searchText) return;

  const searchRegex = new RegExp(searchText, 'i');
  pipeline.push({
    $match: {
      $or: [
        { 'trackerItem.name': searchRegex },
        { 'trackerItem.reference': searchRegex },
        { 'businessUnit.name': searchRegex },
        { 'responsible.displayName': searchRegex },
      ],
    },
  });
};

const addPaginationAndProjection = (
  pipeline: PipelineStage[],
  sortBy: string,
  sortDirection: string,
  offset: number,
  limit: number,
  info: GraphQLResolveInfo
): void => {
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
};

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

    addPermissionFilter(pipeline, user);

    const { _id, trackerItemsIds, regulatoryBodiesIds, categoriesIds, businessUnitsIds, locationsIds,
      usersIds, dueDate, itemStatus, status, includeNotPublished, searchText, ...questionsQuery } = responsesQuery || {};

    addBasicFilters(pipeline, _id, trackerItemsIds, businessUnitsIds);
    addDueDateFilter(pipeline, dueDate);
    addPublishedFilter(pipeline, user, includeNotPublished);

    if (shouldJoinTrackerItem(includeNotPublished, categoriesIds, regulatoryBodiesIds, itemStatus, searchText, shouldJoin, sortBy)) {
      join({
        pipeline,
        collection: 'trackerItems',
        from: 'trackerItemId',
        to: 'trackerItem',
      });
    }

    addCategoryAndLocationFilters(pipeline, categoriesIds, locationsIds);
    addUserFilters(pipeline, usersIds);
    addRegulatoryBodyFilter(pipeline, regulatoryBodiesIds);
    addCustomQuestionsFilter(pipeline, questionsQuery);
    addRelatedJoins(pipeline, shouldJoin, searchText);

    if (itemStatus || shouldJoin(['calculatedStatus']) || sortBy === 'calculatedStatus') {
      addCalculatedStatusPipeline(pipeline, organization);
    }

    addStatusFilters(pipeline, itemStatus, status);
    addUserJoins(pipeline, searchText, shouldJoin);
    addSearchTextFilter(pipeline, searchText);
    addPaginationAndProjection(pipeline, sortBy, sortDirection, offset, limit, info);

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
