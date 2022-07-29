
import { GraphQLResolveInfo } from 'graphql';

import { RegulatoryBodies, Responses } from 'app-models';
import { doesPathExist, join } from 'app-utils';

const regulatoryBodies = async (
  _,
  __,
  { organization },
  info: GraphQLResolveInfo,
) => {
  const shouldJoin = (element: string) =>
    doesPathExist(info.fieldNodes, ['regulatoryBodies', element]);
  try {
    const regulatoryBodies = await RegulatoryBodies.customFind(
      {},
      organization._id,
    );

    if (shouldJoin('complianceItemsResponsesCount')) {
      for (const regulatoryBody of regulatoryBodies) {
        const pipeline: any[] = [];
        join({
          pipeline,
          collection: 'trackerItems',
          from: 'complianceItemId',
          to: 'complianceItem',
        });
        pipeline.push({
          $match: {
            'complianceItem.regulatoryBodyId': regulatoryBody._id,
            'complianceItem.metatags.removedAt': { $eq: null },
            published: true,
          },
        });
        pipeline.push({
          $count: 'count',
        });
        const responses = await Responses.aggregate(pipeline);
        if (responses && responses.length > 0)
          regulatoryBody.complianceItemsResponsesCount = responses[0].count;

      }
    }

    return regulatoryBodies.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err: any) {
    throw new Error(err);
  }
};

export default regulatoryBodies;
