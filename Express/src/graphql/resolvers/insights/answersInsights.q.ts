import { format } from 'date-fns';
import { GraphQLResolveInfo } from 'graphql';
import { groupBy, sumBy } from 'lodash';

import { Answers, Users } from 'app-models';
import { doesPathExist, join } from 'app-utils';

const answersInsights = async (_, { answersInsightsQuery }, { authorize, organization }, info: GraphQLResolveInfo) => {
  const shouldJoin = (elements: string[]) => doesPathExist(info.fieldNodes, ['answersInsights', ...elements]);

  try {
    await authorize();

    const pipeline: any[] = [
      {
        $match: {
          'metatags.removedAt': { $eq: null },
          organizationId: organization._id,
        },
      },
    ];

    join({
      pipeline,
      collection: 'questions',
      from: 'questionId',
      to: 'question',
    });

    pipeline.push({
      $match: {
        'question.questionsCategoryId': answersInsightsQuery.questionsCategoriesId,
      },
    });

    const answers = await Answers.aggregate(pipeline);

    let totalAnswers;
    let closedAnswers;
    let resolvedAnswers;
    let openAnswers;
    let totalAnswersChart;
    let mostAddedBy;

    if (shouldJoin(['totalAnswers'])) totalAnswers = answers.length ?? 0;

    if (shouldJoin(['closedAnswers'])) closedAnswers = answers.filter((answer) => answer.status === 'closed').length ?? 0;

    if (shouldJoin(['resolvedAnswers'])) resolvedAnswers = answers.filter((answer) => answer.status === 'resolved').length ?? 0;

    if (shouldJoin(['openAnswers'])) openAnswers = answers.filter((answer) => answer.status === 'open').length ?? 0;

    if (shouldJoin(['totalAnswersChart'])) {
      const answersGroupedByMonth = groupBy(
        Object.entries(groupBy(answers, 'metatags.addedAt')).map(([key, value]) => ({
          date: format(new Date(key), 'MMM yy'),
          answers: (value as Array<any>).length,
        })),
        'date',
      );

      totalAnswersChart = Object.entries(answersGroupedByMonth).reduce(
        (acc: { dates: string[]; counts: number[] }, [key, value]) => ({
          dates: [...acc?.dates, key],
          counts: [...acc?.counts, sumBy(value, 'answers')],
        }),
        { dates: [], counts: [] },
      );
    }

    if (shouldJoin(['mostAddedBy'])) {
      mostAddedBy = Object.entries(groupBy(answers, 'metatags.addedBy'))
        .map(([key, value]) => ({
          _id: key,
          answers: (value as Array<any>).length,
        }))
        .sort((firstAnswerCreator, secondAnswerCreator) => secondAnswerCreator.answers - firstAnswerCreator.answers);
    }

    if (shouldJoin(['mostAddedBy', 'user'])) {
      mostAddedBy = await Promise.all(
        mostAddedBy.map(
          async (user) => {
            try {
              return {
                ...user,
                user: await Users.customFindByIdWithDetails({
                  userId: user?._id,
                  organization,
                }),
              };
            } catch (e) {
              console.error(`Error occured in answers insights for user with ID ${user?._id}: ${e}`);
              return { user };
            }
          },
        ),
      );
    }

    return {
      totalAnswers,
      closedAnswers,
      resolvedAnswers,
      openAnswers,
      totalAnswersChart,
      mostAddedBy,
    };
  } catch (err: any) {
    throw new Error(err);
  }
};

export default answersInsights;
