import { GraphQLResolveInfo } from 'graphql';
import { PipelineStage } from 'mongoose';

import { AuditTypes } from 'app-models';
import { doesPathExist } from 'app-utils';

const auditTypes = async (_, __, { organization }, info: GraphQLResolveInfo) => {
  const shouldJoin = (elements: string[]) => doesPathExist(info.fieldNodes, ['auditTypes', ...elements]);
  try {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          'metatags.removedAt': { $eq: null },
          organizationId: organization._id,
        },
      },
    ];

    if (shouldJoin(['questionsCategories'])) {
      pipeline.push({
        $lookup: {
          from: 'questionsCategories',
          localField: 'sections._id',
          foreignField: '_id',
          as: 'questionsCategories',
        },
      });
    }

    const auditTypes = await AuditTypes.aggregate(pipeline);
    return auditTypes;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default auditTypes;
