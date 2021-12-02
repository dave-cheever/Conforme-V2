import { GraphQLResolveInfo } from "graphql";
import { Responses } from "app-models";
import { doesPathExist, getProjectFields, isPermitted, join } from "app-utils";
import { addMonths, endOfDay, endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek } from "date-fns";
import { GraphService } from "app-services";

const responses = async (_, { responsesQueryInput }, { authorize }, info: any) => {
  const shouldJoin = (elements: string[]) => doesPathExist(info.fieldNodes, [
    'responses',
    ...elements,
  ]);
  try {
    const user = authorize();
    const pipeline: any[] = [];

    // Filter by response id
    if (responsesQueryInput?._id) {
      pipeline.push({
        $match: {
          _id: responsesQueryInput._id,
        },
      });
    }

    // Filter by compliance item id
    if (responsesQueryInput?.complianceItemsIds) {
      pipeline.push({
        $match: {
          complianceItemId: { $in: responsesQueryInput.complianceItemsIds },
        },
      });
    }

    // Filter by business unit id
    if (responsesQueryInput?.businessUnitsIds) {
      pipeline.push({
        $match: {
          businessUnitId: { $in: responsesQueryInput.businessUnitsIds },
        },
      });
    }

    // Filter by due date
    if (responsesQueryInput?.dueDate) {
      const [filter, startDate, endDate] = responsesQueryInput?.dueDate;
      let $match;
      switch (filter) {
        case 'noDueDate':
          $match = {
            nextRenewalDate: {
              $eq: null,
            },
          };
          break;
        case 'thisWeek':
          $match = {
            $and: [{
              nextRenewalDate: {
                $gte: startOfWeek(new Date(), { weekStartsOn: 1 }).valueOf(),
              }
            }, {
              nextRenewalDate: {
                $lte: endOfWeek(new Date(), { weekStartsOn: 1 }).valueOf(),
              }
            }],
          };
          break;
        case 'thisMonth':
          $match = {
            $and: [{
              nextRenewalDate: {
                $gte: startOfMonth(new Date()).valueOf(),
              }
            }, {
              nextRenewalDate: {
                $lte: endOfMonth(new Date()).valueOf(),
              }
            }],
          };
          break;
        case 'nextMonth':
          $match = {
            $and: [{
              nextRenewalDate: {
                $gte: startOfMonth(addMonths(new Date(), 1)).valueOf(),
              }
            }, {
              nextRenewalDate: {
                $lte: endOfMonth(addMonths(new Date(), 1)).valueOf(),
              }
            }],
          };
          break;
        case 'exactDate':
          $match = {
            $and: [{
              nextRenewalDate: {
                $gte: startOfDay(new Date(startDate)).valueOf(),
              }
            }, {
              nextRenewalDate: {
                $lte: endOfDay(new Date(startDate)).valueOf(),
              }
            }],
          };
          break;
        case 'dateRange':
          if (startDate && endDate) {
            $match = {
              $and: [{
                nextRenewalDate: {
                  $gte: startOfDay(new Date(startDate)).valueOf(),
                }
              }, {
                nextRenewalDate: {
                  $lte: endOfDay(new Date(endDate)).valueOf(),
                }
              }],
            };
          }
          break;
      }
      if ($match) {
        pipeline.push({ $match });
      }
    }

    // Join compliance item
    if (
      // Need to get Compliance Item if there are any dependant filters
      responsesQueryInput?.includeNotPublished ||
      responsesQueryInput?.categoriesIds ||
      responsesQueryInput?.regulatoryBodiesIds ||
      shouldJoin(['complianceItem'])
    ) {
      join({
        pipeline,
        collection: 'complianceItems',
        from: 'complianceItemId',
        to: 'complianceItem',
      });
    }

    // Filter by published state
    if (!(responsesQueryInput?.includeNotPublished && isPermitted({ user, action: 'responses.viewAll' }))) {
      pipeline.push({
        $match: {
          'complianceItem.published': true,
        },
      });
    }

    // Filter by category id (in compliance item)
    if (responsesQueryInput?.categoriesIds) {
      pipeline.push({
        $match: {
          'complianceItem.categoryId': { $in: responsesQueryInput.categoriesIds },
        },
      });
    }

    // Filter by regulatory body id (in compliance item)
    if (responsesQueryInput?.regulatoryBodiesIds) {
      pipeline.push({
        $match: {
          'complianceItem.regulatoryBodyId': { $in: responsesQueryInput.regulatoryBodiesIds },
        },
      });
    }

    // Join category
    if (shouldJoin(['complianceItem', 'category'])) {
      join({
        pipeline,
        collection: 'categories',
        from: 'complianceItem.categoryId',
        to: 'complianceItem.category',
      });
    }
    
    // Join regulatory body
    if (shouldJoin(['complianceItem', 'regulatoryBody'])) {
      join({
        pipeline,
        collection: 'regulatoryBodies',
        from: 'complianceItem.regulatoryBodyId',
        to: 'complianceItem.regulatoryBody',
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

    // Filter by user id (in business unit)
    // It looks at business unit owner and response delegates
    if (responsesQueryInput?.usersIds) {
      pipeline.push({
        $match: {
          $or: [{
            'businessUnit.ownerId': { $in: responsesQueryInput.usersIds },
          }, {
            delegateIds: { $in: responsesQueryInput.usersIds },
          }],
        },
      });
    }

    pipeline.push({ $project: getProjectFields(info.fieldNodes, 'responses') });

    const responses = await Responses.aggregate(pipeline);
    return responses;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default responses;
