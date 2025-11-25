
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
      const promises = categories.map(async (category) => {
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
  
        try {
          const responses = await Responses.aggregate(pipeline);
          if (responses && responses.length > 0) {
            category.trackerItemsResponsesCount = responses[0].count;
          }
        } catch (error) {
          console.error(`Error fetching tracker item count for category ${category._id}:`, error);
        }
        return category;
      });
  
      // Wait for all promises to resolve (all category counts to be fetched)
      await Promise.all(promises);
    }
    // Remove duplicates - keep the first occurrence based on _id (or name as fallback)
    const uniqueCategoriesMap = new Map<string, typeof categories[0]>();
    categories.forEach((category) => {
      if (!category) return;
      const uniqueKey = category._id || category.name;
      if (uniqueKey && !uniqueCategoriesMap.has(uniqueKey)) {
        uniqueCategoriesMap.set(uniqueKey, category);
      }
    });

    return Array.from(uniqueCategoriesMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  } catch (err: any) {
    throw new Error(err);
  }
};

export default categories;
