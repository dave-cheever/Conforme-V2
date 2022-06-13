import { GraphQLResolveInfo } from 'graphql';

import { Questions, Users } from 'app-models';
import { doesPathExist, getProjectFields, isPermitted, join } from 'app-utils';

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
    if (!isPermitted({ user, action: 'questions.viewAll' })) {
      // If user doesn't have permissions to get all questions
      // need to check if he is an area or site owner
      join({
        pipeline,
        collection: 'audits',
        from: 'scope._id',
        to: 'audit',
      });
      join({
        pipeline,
        collection: 'locations',
        from: 'audit.siteId',
        to: 'audit.site',
      });
      join({
        pipeline,
        collection: 'businessUnits',
        from: 'audit.areaId',
        to: 'audit.area',
      });

      /**
       * User's direct reports. The user is a manager of these users.
       */
      const users = await Users.customFindWithDetails({ selector: { managerId: user._id }, organization });

      /**
       * Array of all users including the user himself and his direct reports
       */
      const userIds = [user._id, ...users.map((user) => user._id)];

      const $or: { [key: string]: string }[] = [];
      userIds.forEach((_id) => {
        $or.push(
          ...[
            {
              'audit.auditorId': _id,
            },
            {
              'audit.participantsIds': _id,
            },
            {
              'audit.site.ownerId': _id,
            },
            {
              'audit.area.ownerId': _id,
            },
          ],
        );
      });

      pipeline.push({
        $match: {
          $or,
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
