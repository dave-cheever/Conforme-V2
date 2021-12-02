import { GraphQLResolveInfo } from 'graphql';

import { RegulatoryBodies, Responses } from "app-models";
import { doesPathExist, join } from 'app-utils';

const regulatoryBodies = async (_, __, ___, info: GraphQLResolveInfo) => {
  const shouldJoin = (element: string) => doesPathExist(info.fieldNodes, [
    'regulatoryBodies',
    element,
  ]);
  try {
    let regulatoryBodies = await RegulatoryBodies.get();
    
    if (shouldJoin('complianceItemsResponsesCount')) {
      for (const regulatoryBody of regulatoryBodies) {
        let pipeline: any[] = [];
        join({
          pipeline,
          collection: 'complianceItems',
          from: 'complianceItemId',
          to: 'complianceItem',
        });
        pipeline.push({
          $match: {
            'complianceItem.regulatoryBodyId': regulatoryBody._id,
          },
        });
        pipeline.push({
          $count: 'count',
        });
        const responses = await Responses.aggregate(pipeline);
        if (responses && responses.length > 0) {
          regulatoryBody.complianceItemsResponsesCount = responses[0].count;
        }
      }
    }

    return regulatoryBodies;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default regulatoryBodies;
