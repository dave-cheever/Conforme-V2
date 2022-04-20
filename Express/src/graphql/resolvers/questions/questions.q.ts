import { GraphQLResolveInfo } from 'graphql';

import { Questions } from 'app-models';
import { doesPathExist } from 'app-utils';

const questions = async (
  _,
  { questionQuery },
  { organization },
  info: GraphQLResolveInfo,
) => {
  const shouldJoin = (element: string) =>
    doesPathExist(info.fieldNodes, ['questions', element]);
  try {
    const pipeline: object[] = [
      {
        $match: {
          'metatags.removedAt': { $eq: null },
          organizationId: organization._id,
        },
      },
    ];

    if (questionQuery.scope) {
      pipeline.push({
        $match: {
          scope: {
            type: questionQuery.scope.type,
            _id: questionQuery.scope._id,
          },
        },
      });
    }

    if (shouldJoin('answer')) {
      pipeline.push(
        {
          $lookup: {
            from: 'answers',
            localField: '_id',
            foreignField: 'questionId',
            as: 'answer',
          },
        },
        {
          $unwind: {
            path: `$answer`,
            preserveNullAndEmptyArrays: true,
          },
        },
      );
    }

    const questions = await Questions.aggregate(pipeline);
    return questions.sort((a, b) => a.question.localeCompare(b.question));
  } catch (err: any) {
    throw new Error(err);
  }
};

export default questions;
