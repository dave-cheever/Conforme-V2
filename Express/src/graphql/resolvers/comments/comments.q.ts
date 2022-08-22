import { GraphQLResolveInfo } from 'graphql';

import { Comments } from 'app-models';
import { doesPathExist, getProjectFields, join } from 'app-utils';

const comments = async (_, { _id }, __, info: GraphQLResolveInfo) => {
  const shouldJoin = (elements: string[]) =>
    doesPathExist(info.fieldNodes, ['comments', ...elements]);

  try {
    const pipeline: any[] = [];

    if (_id) {
      pipeline.push({
        $match: {
          componentId: _id,
          'metatags.removedAt': { $eq: null },
        },
      });
    }

    if (shouldJoin(['author'])) {
      join({
        pipeline,
        collection: 'users',
        from: 'authorId',
        to: 'author',
      });
    }

    pipeline.push({ $project: getProjectFields(info.fieldNodes, 'comments') });

    const comments = await Comments.aggregate(pipeline);

    return comments;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default comments;
