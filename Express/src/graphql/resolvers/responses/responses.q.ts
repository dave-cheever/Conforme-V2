import { GraphQLResolveInfo } from "graphql";
import { Responses, Users } from "app-models";
import { doesPathExist, getProjectFields, isPermitted, join } from "app-utils";
import { addMonths, endOfDay, endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek, intervalToDuration, isSameDay } from "date-fns";
import { response } from "express";

const responses = async (_, { responsesQuery }, { authorize, organization }, info: GraphQLResolveInfo) => {
  const shouldJoin = (elements: string[]) => doesPathExist(info.fieldNodes, [
    'responses',
    ...elements,
  ]);
  try {
    const user = await authorize();
    const pipeline: any[] = [{
      $match: {
        organizationId: organization._id
      },
    }];

    if (!isPermitted({ user, action: 'responses.viewAll', data: { response } })) {
      pipeline.push({
        $match: {
          $or: [
            { accountableId: user._id },
            { responsibleId: user._id },
            { contributorsIds: { $in: [user._id] } },
            { followersIds: { $in: [user._id] } }
          ]
        }
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

    // Filter by compliance item id
    if (responsesQuery?.complianceItemsIds) {
      pipeline.push({
        $match: {
          complianceItemId: { $in: responsesQuery.complianceItemsIds },
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
      responsesQuery?.includeNotPublished ||
      responsesQuery?.categoriesIds ||
      responsesQuery?.regulatoryBodiesIds ||
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
    if (!(responsesQuery?.includeNotPublished && isPermitted({ user, action: 'responses.viewAll' }))) {
      pipeline.push({
        $match: {
          'published': true,
        },
      });
    }

    // Filter by category id (in compliance item)
    if (responsesQuery?.categoriesIds) {
      pipeline.push({
        $match: {
          'complianceItem.categoryId': { $in: responsesQuery.categoriesIds },
        },
      });
    }

    // Filter by regulatory body id (in compliance item)
    if (responsesQuery?.regulatoryBodiesIds) {
      pipeline.push({
        $match: {
          'complianceItem.regulatoryBodyId': { $in: responsesQuery.regulatoryBodiesIds },
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

    pipeline.push({ $project: getProjectFields(info.fieldNodes, 'responses') });

    const responses = await Responses.aggregate(pipeline);

    // Join responsible
    if (shouldJoin(['responsible'])) {
      for (const response of responses) {
        try {
          response.responsible = await Users.customFindByIdWithDetails({ userId: response.responsibleId, organization });
        } catch (e) {
          console.log(`Error occured for ${response._id}: ${e}`);
        }
      }
    }

    if (shouldJoin(["daysToDueDate"])) {
      for (const response of responses) {
        const start = new Date(response.nextRenewalDate);
        const end = new Date();
        if (isSameDay(start, end)) {
          response.daysToDueDate = 0;
        } else {
          response.daysToDueDate = intervalToDuration({ start, end }).days || 1;
        }
      }
    }

    return responses;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default responses;
