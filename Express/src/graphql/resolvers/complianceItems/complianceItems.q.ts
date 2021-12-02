import { GraphQLResolveInfo } from "graphql";

import { ComplianceItems } from "app-models";
import { doesPathExist, getProjectFields, isPermitted, join } from "app-utils";

const complianceItems = async (_, { complianceItemsQueryInput }, { authorize }, info: GraphQLResolveInfo) => {
  const shouldJoin = (element: string) => doesPathExist(info.fieldNodes, ["complianceItems", element]);
  try {
    const user = await authorize();
    
    if (!isPermitted({ user, action: "complianceItems.view" })) {
      throw new Error("User is not permitted");
    }

    const pipeline: any[] = [{
      $match: {
        "metatags.removedAt": { $eq: null },
        ...complianceItemsQueryInput,
      },
    }];
    
    if (shouldJoin('category')) {
      join({ 
        pipeline,
        collection: 'categories', 
        from: 'categoryId',
        to: 'category',
      });
    };
    
    if (shouldJoin('regulatoryBody')) {
      join({ 
        pipeline,
        collection: 'regulatoryBodies', 
        from: 'regulatoryBodyId',
        to: 'regulatoryBody',
      });
    };
    
    pipeline.push({ $project: getProjectFields(info.fieldNodes, 'complianceItems') });
    
    const complianceItems = await ComplianceItems.aggregate(pipeline);
    return complianceItems;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default complianceItems;
