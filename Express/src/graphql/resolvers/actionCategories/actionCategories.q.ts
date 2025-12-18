import { GraphQLResolveInfo } from 'graphql';
import { PipelineStage } from 'mongoose';

import { ActionCategories } from 'app-models';
import { IPagination } from 'app-interfaces';

const buildPaginationStages = (pagination: IPagination): PipelineStage[] => {
  const sortBy = pagination?.sortBy || 'metatags.addedAt';
  const sortDirection = pagination?.sortDirection === 'asc' ? 1 : -1;
  const limit = pagination?.limit || 15;
  const offset = pagination?.offset || 0;

  return [
    {
      $facet: {
        actionCategories: [{ $sort: { [sortBy]: sortDirection } }, { $skip: offset }, { $limit: limit }],
        total: [{ $count: 'total' }],
      },
    },
    {
      $unwind: {
        path: '$total',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        actionCategories: 1,
        total: '$total.total',
      },
    },
  ];
};

const actionCategories = async (_, { pagination }, { organization }, info: GraphQLResolveInfo) => {
  try {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          'metatags.removedAt': { $eq: null },
          organizationId: organization._id,
        },
      },
    ];

    const paginationInput = pagination;
    pipeline.push(...buildPaginationStages(paginationInput));

    const result = await ActionCategories.aggregate(pipeline);
    
    return {
      actionCategories: result[0]?.actionCategories || [],
      total: result[0]?.total || 0,
    };
  } catch (err: any) {
    throw new Error(err);
  }
};

export default actionCategories;

