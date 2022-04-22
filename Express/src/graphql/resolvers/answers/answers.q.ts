import { compareDesc } from 'date-fns';
import { GraphQLResolveInfo } from 'graphql';

import { Answers, Users } from 'app-models';
import { doesPathExist, getProjectFields, join } from 'app-utils';

const answers = async (
  _,
  { answerQuery },
  { organization },
  info: GraphQLResolveInfo,
) => {
  try {
    const shouldJoin = (elements: string[]) =>
      doesPathExist(info.fieldNodes, ['answers', ...elements]);
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

    if (shouldJoin(['audit'])) {
      join({
        pipeline,
        collection: 'audits',
        from: 'scope._id',
        to: 'audit',
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

    pipeline.push({ $project: getProjectFields(info.fieldNodes, 'answers') });

    let answers = await Answers.aggregate(pipeline);

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

    return answers.sort((a, b) =>
      compareDesc(
        new Date(a?.metatags?.addedAt),
        new Date(b?.metatags?.addedAt),
      ),
    );
  } catch (err: any) {
    throw new Error(err);
  }
};

export default answers;
