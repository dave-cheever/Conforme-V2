import { GraphQLResolveInfo } from "graphql";

import { ComplianceItems } from "app-models";
import { doesPathExist, isPermitted } from "app-utils";

const complianceItems = async (_, __, { authorize }, info: GraphQLResolveInfo) => {
  const shouldJoin = (element: string) => doesPathExist(info.fieldNodes, ["complianceItems", element]);
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: "complianceItems.view" })) {
      throw new Error("User is not permitted");
    }

    const pipeline: any[] = [{
      $match: {
        "metatags.removedAt": { $eq: null },
      },
    }];

    if (shouldJoin('category')) {
      pipeline.push({
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      }, {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true,
        },
      });
    };

    if (shouldJoin('functionalArea')) {
      pipeline.push({
        $lookup: {
          from: 'functionalareas',
          localField: 'functionalAreaId',
          foreignField: '_id',
          as: 'functionalArea',
        },
      }, {
        $unwind: {
          path: '$functionalArea',
          preserveNullAndEmptyArrays: true,
        },
      });
    };

    if (shouldJoin('regulatoryBody')) {
      pipeline.push({
        $lookup: {
          from: 'regulatorybodies',
          localField: 'regulatoryBodyId',
          foreignField: '_id',
          as: 'regulatoryBody',
        },
      }, {
        $unwind: {
          path: '$regulatoryBody',
          preserveNullAndEmptyArrays: true,
        },
      });
    };
    
    pipeline.push({
      $project: {
        name: 1,
        description: 1,
        categoryId: 1,
        regulatoryBodyId: 1,
        functionalAreaId: 1,
        dueDate: 1,
        frequency: 1,
        businessUnitsIds: 1,
        evidenceItems: 1,
        retentionPeriod: 1,
        questions: 1,
        published: 1,
        ref: 1,
        "category.name": 1,
        "functionalArea.name": 1,
        "regulatoryBody.name": 1,
      }
    });

    const complianceItems = await ComplianceItems.aggregate(pipeline);
    return complianceItems;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default complianceItems;
