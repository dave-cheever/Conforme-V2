
import { GraphQLResolveInfo } from 'graphql';
import { PipelineStage } from 'mongoose';

import { TrackerItems } from 'app-models';
import { doesPathExist, getProjectFields, isPermitted, join } from 'app-utils';

const trackerItems = async (
  _,
  { trackerItemsQueryInput },
  { authorize, organization },
  info: GraphQLResolveInfo,
) => {
  const shouldJoin = (element: string) =>
    doesPathExist(info.fieldNodes, ['trackerItems', element]);
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: 'trackerItems.view' }))
      throw new Error('User is not permitted');

    const pipeline: PipelineStage[] = [
      {
        $match: {
          'metatags.removedAt': { $eq: null },
          organizationId: organization._id,
        },
      },
    ];

    // Filter By published
    if (trackerItemsQueryInput?.hasOwnProperty('published')) {
      pipeline.push({
        $match: {
          published: trackerItemsQueryInput?.published,
        },
      });
    }

    // Filter by tracker item id
    if (trackerItemsQueryInput?.trackerItemsIds) {
      pipeline.push({
        $match: {
          _id: { $in: trackerItemsQueryInput.trackerItemsIds },
        },
      });
    }

    // Filter by regulatory body id
    if (trackerItemsQueryInput?.regulatoryBodiesIds) {
      pipeline.push({
        $match: {
          regulatoryBodyId: {
            $in: trackerItemsQueryInput.regulatoryBodiesIds,
          },
        },
      });
    }

    // Filter by category id
    if (trackerItemsQueryInput?.categoriesIds) {
      pipeline.push({
        $match: {
          categoryId: { $in: trackerItemsQueryInput.categoriesIds },
        },
      });
    }

    // Filter by business unit id
    if (trackerItemsQueryInput?.businessUnitsIds) {
      pipeline.push({
        $match: {
          businessUnitsIds: { $in: trackerItemsQueryInput.businessUnitsIds },
        },
      });
    }

    // Filter by location id (in tracker item)
    if (trackerItemsQueryInput?.locationsIds) {
      pipeline.push({
        $match: {
          locationsIds: { $in: trackerItemsQueryInput.locationsIds },
        },
      });
    }

    if (shouldJoin('category')) {
      join({
        pipeline,
        collection: 'categories',
        from: 'categoryId',
        to: 'category',
      });
    }

    if (shouldJoin('regulatoryBody')) {
      join({
        pipeline,
        collection: 'regulatoryBodies',
        from: 'regulatoryBodyId',
        to: 'regulatoryBody',
      });
    }

    pipeline.push({
      $project: getProjectFields(info.fieldNodes, 'trackerItems'),
    });

    const trackerItems = await TrackerItems.aggregate(pipeline);
    return trackerItems;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default trackerItems;
