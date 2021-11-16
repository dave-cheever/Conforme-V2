import { GraphQLResolveInfo } from "graphql";
import { Responses } from "app-models";
import { doesPathExist, getProjectFields, join } from "app-utils";

const responses = async (_, { responsesQueryInput }, ___, info: any) => {
  
  const shouldJoin = (elements: string[]) => doesPathExist(info.fieldNodes, [
    'responses',
    ...elements,
  ]);
  try {
    const pipeline: any[] = [];

    if(responsesQueryInput && responsesQueryInput._id) {
      pipeline.push({
        $match: {
          _id: responsesQueryInput._id,
        },
      });
    }

    if (shouldJoin(['complianceItem'])) {
      join({
        pipeline,
        collection: 'complianceItems',
        from: 'complianceItemId',
        to: 'complianceItem',
      });
    };

    if (shouldJoin(['complianceItem', 'category'])) {
      join({
        pipeline,
        collection: 'categories',
        from: 'complianceItem.categoryId',
        to: 'complianceItem.category',
      });
    };

    if (shouldJoin(['complianceItem', 'functionalArea'])) {
      join({
        pipeline,
        collection: 'functionalAreas',
        from: 'complianceItem.functionalAreaId',
        to: 'complianceItem.functionalArea',
      });
    }

    if (shouldJoin(['complianceItem', 'regulatoryBody'])) {
      join({
        pipeline,
        collection: 'regulatoryBodies',
        from: 'complianceItem.regulatoryBodyId',
        to: 'complianceItem.regulatoryBody',
      });
    }

    if (shouldJoin(['businessUnit'])) {
      join({
        pipeline,
        collection: 'businessUnits',
        from: 'businessUnitId',
        to: 'businessUnit',
      });
    };

    pipeline.push({ $project: getProjectFields(info.fieldNodes, 'responses') });

    const responses = await Responses.aggregate(pipeline);
    return responses;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default responses;
