
import { GraphQLResolveInfo } from 'graphql';

import { ComplianceItems } from 'app-models';
import { doesPathExist, getProjectFields, isPermitted, join } from 'app-utils';

const complianceItems = async (
  _,
  { complianceItemsQueryInput },
  { authorize, organization },
  info: GraphQLResolveInfo,
) => {
  const shouldJoin = (element: string) =>
    doesPathExist(info.fieldNodes, ['complianceItems', element]);
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: 'complianceItems.view' })) 
      throw new Error('User is not permitted');

    const pipeline: any[] = [
      {
        $match: {
          'metatags.removedAt': { $eq: null },
          organizationId: organization._id,
        },
      },
    ];

    // Filter By published
    if (complianceItemsQueryInput?.hasOwnProperty('published')) {
      pipeline.push({
        $match: {
          published: complianceItemsQueryInput?.published,
        },
      });
    }

    // Filter by compliance item id
    if (complianceItemsQueryInput?.complianceItemsIds) {
      pipeline.push({
        $match: {
          _id: { $in: complianceItemsQueryInput.complianceItemsIds },
        },
      });
    }

    // Filter by regulatory body id
    if (complianceItemsQueryInput?.regulatoryBodiesIds) {
      pipeline.push({
        $match: {
          regulatoryBodyId: {
            $in: complianceItemsQueryInput.regulatoryBodiesIds,
          },
        },
      });
    }

    // Filter by category id
    if (complianceItemsQueryInput?.categoriesIds) {
      pipeline.push({
        $match: {
          categoryId: { $in: complianceItemsQueryInput.categoriesIds },
        },
      });
    }

    // Filter by business unit id
    if (complianceItemsQueryInput?.businessUnitsIds) {
      pipeline.push({
        $match: {
          businessUnitsIds: { $in: complianceItemsQueryInput.businessUnitsIds },
        },
      });
    }

    // Filter by location id (in compliance item)
    if (complianceItemsQueryInput?.locationsIds) {
      pipeline.push({
        $match: {
          locationsIds: { $in: complianceItemsQueryInput.locationsIds },
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
      $project: getProjectFields(info.fieldNodes, 'complianceItems'),
    });

    const complianceItems = await ComplianceItems.aggregate(pipeline);
    return complianceItems;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default complianceItems;
