import { GraphQLResolveInfo } from "graphql";
import { Responses } from "app-models";
import { doesPathExist } from "app-utils";

const responses = async (_, __, ___, info: any) => {
  const shouldJoin = (element: string) => doesPathExist(info.fieldNodes, [
    'responses',
    element,
  ]);
  try {
    const pipeline: any[] = [];

    if (shouldJoin('complianceItem')) {
      pipeline.push({
        $lookup: {
          from: 'complianceitems',
          localField: 'complianceItemId',
          foreignField: '_id',
          as: 'complianceItem',
        },
      }, {
        $unwind: '$complianceItem'
      });
    };

    if (shouldJoin('businessUnit')) {
      pipeline.push({
        $lookup: {
          from: 'businessunits',
          localField: 'businessUnitId',
          foreignField: '_id',
          as: 'businessUnit',
        },
      }, {
        $unwind: '$businessUnit'
      });
    };

    if (shouldJoin('category')) {
      pipeline.push({
        $lookup: {
          from: 'categories',
          localField: 'complianceItem.categoryId',
          foreignField: '_id',
          as: 'category',
        },
      }, {
        $unwind: '$category'
      });
    };

    if (shouldJoin('functionalArea')) {
      pipeline.push({
        $lookup: {
          from: 'functionalareas',
          localField: 'complianceItem.functionalAreaId',
          foreignField: '_id',
          as: 'functionalArea',
        },
      }, {
        $unwind: '$functionalArea'
      });
    }

    if (shouldJoin('regulatoryBody')) {
      pipeline.push({
        $lookup: {
          from: 'regulatorybodies',
          localField: 'complianceItem.regulatoryBodyId',
          foreignField: '_id',
          as: 'regulatoryBody',
        },
      }, {
        $unwind: '$regulatoryBody'
      });
    }
    
    pipeline.push({
      $project: {
        businessUnitId: 1,
        delegateIds: 1,
        lastRenewalDate: 1,
        nextRenewalDate: 1,
        status: 1,
        published: 1,
        complianceItem: 1,
        businessUnit: 1,
        category: 1,
        functionalArea: 1,
        regulatoryBody: 1
      }
    });
    
    const responses = await Responses.aggregate(pipeline);

    return responses;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default responses;
