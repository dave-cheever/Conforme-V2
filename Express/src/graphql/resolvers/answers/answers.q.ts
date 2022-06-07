import { compareDesc } from 'date-fns';
import { GraphQLResolveInfo } from 'graphql';

import { Answers, Users } from 'app-models';
import { doesPathExist, getProjectFields, join } from 'app-utils';

const answers = async (_, { answerQuery }, { authorize, organization }, info: GraphQLResolveInfo) => {
  const shouldJoin = (elements: string[]) => doesPathExist(info.fieldNodes, ['answers', ...elements]);
  try {
    const user = await authorize();
    const pipeline: any[] = [
      {
        $match: {
          'metatags.removedAt': { $eq: null },
          organizationId: organization._id,
        },
      },
    ];

    if (answerQuery?._id) {
      pipeline.push({
        $match: {
          _id: answerQuery._id,
        },
      });
    }

    if (shouldJoin(['question'])) {
      join({
        pipeline,
        collection: 'questions',
        from: 'questionId',
        to: 'question',
      });

      if (answerQuery?.questionsCategoriesIds?.length > 0) {
        pipeline.push({
          $match: {
            'question.questionsCategoryId': {
              $in: answerQuery.questionsCategoriesIds,
            },
          },
        });
      }
    }

    if (shouldJoin(['question', 'questionsCategory'])) {
      join({
        pipeline,
        collection: 'questionsCategories',
        from: 'question.questionsCategoryId',
        to: 'question.questionsCategory',
      });
    }

    if (shouldJoin(['actions'])) {
      pipeline.push({
        $lookup: {
          from: 'actions',
          localField: '_id',
          foreignField: 'scope._id',
          as: 'actions',
        },
      });
    }

    if (shouldJoin(['audit']) || user.role === 'user') {
      join({
        pipeline,
        collection: 'audits',
        from: 'scope._id',
        to: 'audit',
      });
    }

    // For "user" role filter answers
    if (user.role === 'user') {
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

    if (shouldJoin(['audit', 'site'])) {
      join({
        pipeline,
        collection: 'locations',
        from: 'audit.siteId',
        to: 'audit.site',
      });
    }

    if (shouldJoin(['audit', 'area'])) {
      join({
        pipeline,
        collection: 'businessUnits',
        from: 'audit.areaId',
        to: 'audit.area',
      });
    }

    if (answerQuery?.areasIds?.length > 0) {
      pipeline.push({
        $match: {
          'audit.areaId': { $in: answerQuery.areasIds },
        },
      });
    }

    pipeline.push({ $project: getProjectFields(info.fieldNodes, 'answers') });

    let answers = await Answers.aggregate(pipeline);

    answers = answers.map((answer) => ({ ...answer, actions: answer.actions.filter((action) => !action?.metatags?.removedAt) }));

    if (shouldJoin(['addedBy'])) {
      answers = await Promise.all(
        answers.map(
          (answer) =>
            // eslint-disable-next-line no-async-promise-executor
            new Promise<any>(async (resolve, reject) => {
              try {
                resolve({
                  ...answer,
                  addedBy: await Users.customFindByIdWithDetails({
                    userId: answer?.metatags?.addedBy,
                    organization,
                  }),
                });
              } catch (e) {
                console.log(`Error occured for ${answer._id}: ${e}`);
                reject();
              }
            }),
        ),
      );
    }

    if (answerQuery?.usersIds?.addedByIds?.length > 0)
      answers = answers.filter((answer) => answerQuery.usersIds.addedByIds.includes(answer.addedBy._id));

    return answers.sort((a, b) => compareDesc(new Date(a?.metatags?.addedAt), new Date(b?.metatags?.addedAt)));
  } catch (err: any) {
    throw new Error(err);
  }
};

export default answers;
