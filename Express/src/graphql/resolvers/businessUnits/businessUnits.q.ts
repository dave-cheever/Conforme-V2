import { GraphQLResolveInfo } from "graphql";

import { BusinessUnits, Responses, Users } from "app-models";
import { doesPathExist, join } from "app-utils";
import { IBusinessUnit } from "app-interfaces";

const businessUnits = async (_, __, { organization }, info: GraphQLResolveInfo) => {
  const shouldJoin = (element: string) => doesPathExist(info.fieldNodes, ["businessUnits", element]);
  try {
    let businessUnits = await BusinessUnits.customFind({}, organization._id);

    if (shouldJoin("complianceItemsResponsesCount")) {
      businessUnits = await Promise.all(businessUnits.map(businessUnit => new Promise<IBusinessUnit>(async res => {
        let pipeline: any[] = [{
          $match: {
            businessUnitId: businessUnit._id,
          },
        }];
        join({
          pipeline,
          collection: 'complianceItems',
          from: 'complianceItemId',
          to: 'complianceItem',
        });
        pipeline.push({
          $match: {
            'complianceItem.metatags.removedAt': { $eq: null },
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
        return res(businessUnit);
      })));
    }

    if (shouldJoin("owner")) {
      await Promise.all(businessUnits.map(businessUnit => new Promise<void>(async (resolve, reject) => {
        try {
          businessUnit.owner = await Users.customFindByIdWithDetails({ userId: businessUnit.ownerId, organization });
          resolve();
        } catch (e) {
          console.log(`Error occured for ${businessUnit._id}: ${e}`);
          reject();
        }
      })));
    }

    return businessUnits.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err: any) {
    throw new Error(err);
  }
};

export default businessUnits;
