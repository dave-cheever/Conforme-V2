import {
  addMonths,
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import { GraphQLResolveInfo } from 'graphql';
import { groupBy, sumBy } from 'lodash';
import { PipelineStage } from 'mongoose';

import { Answers } from 'app-models';
import { doesPathExist, join } from 'app-utils';

const answersInsights = async (_, { answersInsightsQueryInput }, { authorize, organization }, info: GraphQLResolveInfo) => {
  const shouldJoin = (elements: string[]) => doesPathExist(info.fieldNodes, ['answersInsights', ...elements]);

  try {
    await authorize();

    const pipeline: PipelineStage[] = [
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
        'question.questionsCategoryId': answersInsightsQueryInput.questionsCategoriesId,
      },
    });

    if (answersInsightsQueryInput?.status?.length > 0) {
      pipeline.push({
        $match: {
          status: {
            $in: answersInsightsQueryInput.status,
          },
        },
      });
    }

    if (answersInsightsQueryInput?.createdDate) {
      const [filter, startDate, endDate] = answersInsightsQueryInput?.createdDate;
      let $match;
      switch (filter) {
        case 'thisWeek':
          $match = {
            $and: [
              {
                'metatags.addedAt': {
                  $gte: startOfWeek(new Date(), { weekStartsOn: 1 }),
                },
              },
              {
                'metatags.addedAt': {
                  $lte: endOfWeek(new Date(), { weekStartsOn: 1 }),
                },
              },
            ],
          };
          break;
        case 'thisMonth':
          $match = {
            $and: [
              {
                'metatags.addedAt': {
                  $gte: startOfMonth(new Date()),
                },
              },
              {
                'metatags.addedAt': {
                  $lte: endOfMonth(new Date()),
                },
              },
            ],
          };
          break;
        case 'thisYear':
          $match = {
            $and: [
              {
                'metatags.addedAt': {
                  $gte: startOfYear(new Date()),
                },
              },
              {
                'metatags.addedAt': {
                  $lte: endOfYear(new Date()),
                },
              },
            ],
          };
          break;
        case 'nextMonth':
          $match = {
            $and: [
              {
                'metatags.addedAt': {
                  $gte: startOfMonth(addMonths(new Date(), 1)),
                },
              },
              {
                'metatags.addedAt': {
                  $lte: endOfMonth(addMonths(new Date(), 1)),
                },
              },
            ],
          };
          break;
        case 'exactDate':
          $match = {
            $and: [
              {
                'metatags.addedAt': {
                  $gte: startOfDay(new Date(startDate)),
                },
              },
              {
                'metatags.addedAt': {
                  $lte: endOfDay(new Date(startDate)),
                },
              },
            ],
          };
          break;
        case 'dateRange':
          if (startDate && endDate) {
            $match = {
              $and: [
                {
                  'metatags.addedAt': {
                    $gte: startOfDay(new Date(startDate)),
                  },
                },
                {
                  'metatags.addedAt': {
                    $lte: endOfDay(new Date(endDate)),
                  },
                },
              ],
            };
          }
          break;
        default:
          break;
      }

      if ($match) pipeline.push({ $match });
    }

    if (answersInsightsQueryInput?.locationsIds?.length > 0) {
      pipeline.push({
        $match: {
          'audit.locationId': { $in: answersInsightsQueryInput.locationsIds },
        },
      });
    }

    if (answersInsightsQueryInput?.businessUnitsIds?.length > 0) {
      pipeline.push({
        $match: {
          'audit.businessUnitId': { $in: answersInsightsQueryInput.businessUnitsIds },
        },
      });
    }

    const answers = await Answers.aggregate(pipeline);

    let totalAnswers;
    let closedAnswers;
    let resolvedAnswers;
    let openAnswers;
    let totalAnswersChart;

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

    return {
      totalAnswers,
      closedAnswers,
      resolvedAnswers,
      openAnswers,
      totalAnswersChart,
    };
  } catch (err: any) {
    throw new Error(err);
  }
};

export default answersInsights;
