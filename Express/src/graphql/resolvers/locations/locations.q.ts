import { GraphQLResolveInfo } from "graphql";

import { Locations, Responses, Users } from "app-models";
import { doesPathExist, join } from "app-utils";

const locations = async (_, __, { organization }, info: GraphQLResolveInfo) => {
  const shouldJoin = (element: string) =>
    doesPathExist(info.fieldNodes, ["locations", element]);
  try {
    let locations = await Locations.customFind({}, organization._id);

    if (shouldJoin("complianceItemsResponsesCount")) {
      for (const location of locations) {
        let pipeline: any[] = [];
        join({
          pipeline,
          collection: 'complianceItems',
          from: 'complianceItemId',
          to: 'complianceItem',
        });
        pipeline.push({
          $match: {
            'complianceItem.locationsIds': { $in: [location._id] },
            "complianceItem.metatags.removedAt": { $eq: null },
            published: true,
          },
        });
        pipeline.push({
          $count: 'count',
        });
        const responses = await Responses.aggregate(pipeline);
        if (responses && responses.length > 0) {
          location.complianceItemsResponsesCount = responses[0].count;
        }
      }
    }

    if (shouldJoin("owner")) {
      for (const location of locations) {
        try {
          location.owner = await Users.customFindByIdWithDetails({ userId: location.ownerId, organization });
        } catch (e) {
          console.log(`Error occured for ${location._id}: ${e}`);
        }
      }
    }

    return locations?.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err: any) {
    throw new Error(err);
  }
};

export default locations;
