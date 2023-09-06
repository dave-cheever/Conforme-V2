import { GraphQLResolveInfo } from 'graphql';
import { PipelineStage } from 'mongoose';

import { AuditLogs, Questions, Users } from 'app-models';
import { doesPathExist, getProjectFields, isPermitted, join } from 'app-utils';

const questions = async (_, { questionQuery }, { authorize, organization }, info: GraphQLResolveInfo) => {
  const shouldJoin = (elements: string[]) => doesPathExist(info.fieldNodes, ['questions', ...elements]);

  try {
    const user = await authorize();
    const pipeline: PipelineStage[] = [
      {
        $match: {
          'metatags.removedAt': { $eq: null },
          organizationId: organization._id,
        },
      },
    ];

    if (questionQuery.scope) {
      pipeline.push({
        $match: Object.entries(questionQuery.scope).reduce((acc, [key, value]) => {
          acc[`scope.${key}`] = value;
          return acc;
        }, {}),
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
      // need to check if he is an businessUnit or location owner
      join({
        pipeline,
        collection: 'audits',
        from: 'scope._id',
        to: 'audit',
      });
      join({
        pipeline,
        collection: 'locations',
        from: 'audit.locationId',
        to: 'audit.location',
      });
      join({
        pipeline,
        collection: 'businessUnits',
        from: 'audit.businessUnitId',
        to: 'audit.businessUnit',
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
              'audit.location.ownerId': _id,
            },
            {
              'audit.businessUnit.ownerId': _id,
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

      pipeline.push({
        $match: {
          'answer.metatags.removedAt': { $eq: null },
        },
      });

      if (shouldJoin(['answer', 'businessUnit'])) {
        join({
          pipeline,
          collection: 'businessUnits',
          from: 'answer.businessUnitId',
          to: 'answer.businessUnit',
        });
      }
    }

    if (shouldJoin(['questionsCategory'])) {
      join({
        pipeline,
        collection: 'questionsCategories',
        from: 'questionsCategoryId',
        to: 'questionsCategory',
      });
    }

    if (shouldJoin(['category'])) {
      join({
        pipeline,
        collection: 'categories',
        from: 'categoryId',
        to: 'category',
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
        ...getProjectFields(info.fieldNodes, 'questions'),
      },
    });

    let questions: any = await Questions.aggregate(pipeline);

    // Because CosmosBD doesn't support $filter pipeline stage, we need to filter out removed actions manually
    if (shouldJoin(['answer', 'actions'])) {
      questions = questions.map((question) => ({
        ...question,
        answer: question.answer?._id
          ? {
            ...question.answer,
            actions: question.answer.actions.filter((action) => !action.metatags.removedAt),
          }
          : undefined,
      }));
    }

    if (shouldJoin(['answer', 'actions', 'assignor'])) {
      questions = await Promise.all(
        questions.map(async (question) => ({
          ...question,
          answer: question.answer?._id
            ? {
              ...question.answer,
              actions: await Promise.all(
                question.answer.actions.map(async (action) => {
                  try {
                    const latestAssociatedAuditLog = await AuditLogs.aggregate([
                      {
                        $match: { organizationId: organization._id, 'element._id': action._id, 'values.assigneeId.new': { $ne: null } },
                      },
                    ]);
                    const assignorId = latestAssociatedAuditLog[0]?.metatags.addedBy;

                    return {
                      ...action,
                      assignor: await Users.customFindByIdWithDetails({
                        userId: assignorId ?? action.metatags.addedBy,
                        organization,
                      }),
                    };
                  } catch (e) {
                    console.log(`Error occured for action with ID ${action._id}: ${e}`);
                    return action;
                  }
                }),
              ),
            }
            : undefined,
        })),
      );
    }

    return questions;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default questions;
