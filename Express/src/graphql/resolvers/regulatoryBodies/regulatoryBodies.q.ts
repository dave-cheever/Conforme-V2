
import { GraphQLResolveInfo } from 'graphql';
import { PipelineStage } from 'mongoose';

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

    if (shouldJoin('trackerItemsResponsesCount')) {
      for (const regulatoryBody of regulatoryBodies) {
        const pipeline: PipelineStage[] = [];
        join({
          pipeline,
          collection: 'trackerItems',
          from: 'trackerItemId',
          to: 'trackerItem',
        });
        pipeline.push({
          $match: {
            'trackerItem.regulatoryBodyId': regulatoryBody._id,
            'trackerItem.metatags.removedAt': { $eq: null },
            published: true,
          },
        });
        pipeline.push({
          $count: 'count',
        });
        const responses = await Responses.aggregate(pipeline);
        if (responses && responses.length > 0)
          regulatoryBody.trackerItemsResponsesCount = responses[0].count;

      }
    }

    // Remove duplicates - keep the first occurrence based on _id (or name as fallback)
    const uniqueRegulatoryBodiesMap = new Map<string, typeof regulatoryBodies[0]>();
    regulatoryBodies.forEach((regulatoryBody) => {
      if (!regulatoryBody) return;
      const uniqueKey = regulatoryBody._id || regulatoryBody.name;
      if (uniqueKey && !uniqueRegulatoryBodiesMap.has(uniqueKey)) {
        uniqueRegulatoryBodiesMap.set(uniqueKey, regulatoryBody);
      }
    });

    return Array.from(uniqueRegulatoryBodiesMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  } catch (err: any) {
    throw new Error(err);
  }
};

export default regulatoryBodies;
