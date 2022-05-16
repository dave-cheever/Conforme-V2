import { GraphQLResolveInfo } from 'graphql';

import { Questions } from 'app-models';
import { doesPathExist, getProjectFields, join } from 'app-utils';

const questions = async (_, { questionQuery }, { authorize, organization }, info: GraphQLResolveInfo) => {
  const shouldJoin = (elements: string[]) => doesPathExist(info.fieldNodes, ['questions', ...elements]);

  try {
    const user = await authorize();
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
          scope: questionQuery.scope,
        },
      });
    }

    if (questionQuery.questionsCategoriesIds) {
      pipeline.push({
        $match: {
          questionsCategoryId: { $in: questionQuery.questionsCategoriesIds },
        },
      });
    }

    // For "user" role filter answers
    if (user.role === 'user') {
      join({
        pipeline,
        collection: 'audits',
        from: 'scope._id',
        to: 'audit',
      });
      pipeline.push({
        $match: {
          $or: [
            {
              'audit.auditorId': user._id,
            },
            {
              'audit.participantsIds': user._id,
            },
          ],
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

    pipeline.push({
      $project: {
        'answer.actions.metatags': shouldJoin(['answer', 'actions']) ? 1 : 0,
        ...getProjectFields(info.fieldNodes, 'questions'),
      },
    });

    let questions: any = await Questions.aggregate(pipeline);

    // Because CosmosBD doesn't support $filter pipeline stage, we need to filter out removed actions manually
    if (shouldJoin(['answer', 'actions'])) {
      questions = questions.map((question) => ({
        ...question,
        answer: question.answer._id
          ? {
              ...question.answer,
              actions: question.answer.actions.filter((action) => !action.metatags.removedAt),
            }
          : undefined,
      }));
    }

    return questions;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default questions;
