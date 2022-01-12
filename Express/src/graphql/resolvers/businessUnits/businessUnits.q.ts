import { GraphQLResolveInfo } from "graphql";

import { BusinessUnits, Responses, Users } from "app-models";
import { doesPathExist, join } from "app-utils";

const businessUnits = async (_, __, { organization }, info: GraphQLResolveInfo) => {
  const shouldJoin = (element: string) => doesPathExist(info.fieldNodes, ["businessUnits", element]);
  try {
    let businessUnits = await BusinessUnits.customFind({}, organization._id);
    
    if (shouldJoin("complianceItemsResponsesCount")) {
      for (const businessUnit of businessUnits) {
        let pipeline: any[] = [];
        join({
          pipeline,
          collection: 'complianceItems',
          from: 'complianceItemId',
          to: 'complianceItem',
        });
        pipeline.push({
          $match: {
            'complianceItem.businessUnitsIds': businessUnit._id,
            published: true,
          },
        });
        pipeline.push({
          $count: 'count',
        });
        const responses = await Responses.aggregate(pipeline);
        if (responses && responses.length > 0) {
          businessUnit.complianceItemsResponsesCount = responses[0].count;
        }
      }
    }

    if (shouldJoin("owner")) {
      for (const businessUnit of businessUnits) {
        try {
          businessUnit.owner = await Users.customFindByIdWithDetails({ userId: businessUnit.ownerId, organization });
        } catch (e) {
          console.log(`Error occured for ${businessUnit._id}: ${e}`);
        }
      }
    }

    return businessUnits;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default businessUnits;
