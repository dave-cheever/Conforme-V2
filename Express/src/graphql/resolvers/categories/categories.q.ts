
import { GraphQLResolveInfo } from 'graphql';
import { PipelineStage } from 'mongoose';

import { Categories, Responses } from 'app-models';
import { doesPathExist, join } from 'app-utils';

const categories = async (
  _,
  { moduleId },
  { organization },
  info: GraphQLResolveInfo,
) => {
  const shouldJoin = (element: string) =>
    doesPathExist(info.fieldNodes, ['categories', element]);
  try {
    const categories = await Categories.customFind({
      ...(moduleId && { 'scope.moduleId': moduleId }),
    }, organization._id);

    if (shouldJoin('trackerItemsResponsesCount')) {
      for (const category of categories) {
        const pipeline: PipelineStage[] = [];
        join({
          pipeline,
          collection: 'trackerItems',
          from: 'trackerItemId',
          to: 'trackerItem',
        });
        pipeline.push({
          $match: {
            'trackerItem.categoryId': category._id,
            'trackerItem.metatags.removedAt': { $eq: null },
            published: true,
          },
        });
        pipeline.push({
          $count: 'count',
        });
        const responses = await Responses.aggregate(pipeline);
        if (responses && responses.length > 0)
          category.trackerItemsResponsesCount = responses[0].count;

      }
    }

    return categories.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err: any) {
    throw new Error(err);
  }
};

export default categories;
