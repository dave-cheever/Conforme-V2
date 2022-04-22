import { GraphQLResolveInfo } from 'graphql';

import { Questions } from 'app-models';
import { doesPathExist, getProjectFields, join } from 'app-utils';

const questions = async (
  _,
  { questionQuery },
  { organization },
  info: GraphQLResolveInfo,
) => {
  const shouldJoin = (elements: string[]) =>
    doesPathExist(info.fieldNodes, ['questions', ...elements]);

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

    if (shouldJoin(['answer'])) {
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

    if (shouldJoin(['questionsCategory'])) {
      join({
        pipeline,
        collection: 'questionsCategories',
        from: 'questionsCategoryId',
        to: 'questionsCategory',
      });
    }

    if (shouldJoin(['answer', 'actions'])) {
      pipeline.push({
        $lookup: {
          from: 'actions',
          localField: 'answer._id',
          foreignField: 'scope._id',
          as: 'answer.actions',
        },
      });
    }

    pipeline.push({ $project: getProjectFields(info.fieldNodes, 'questions') });

    const questions = await Questions.aggregate(pipeline);
    return questions.sort((a, b) => a.question.localeCompare(b.question));
  } catch (err: any) {
    throw new Error(err);
  }
};

export default questions;
