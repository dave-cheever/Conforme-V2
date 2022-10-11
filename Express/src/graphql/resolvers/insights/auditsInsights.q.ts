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

import { Audits } from 'app-models';
import { doesPathExist } from 'app-utils';

const auditsInsights = async (_, { auditsInsightsQueryInput }, { authorize, organization }, info: GraphQLResolveInfo) => {
  const shouldJoin = (elements: string[]) => doesPathExist(info.fieldNodes, ['auditsInsights', ...elements]);

  try {
    await authorize();

    const pipeline: any[] = [
      {
        $match: {
          'metatags.removedAt': auditsInsightsQueryInput?.showArchived ? { $exists: true } : { $eq: null },
          organizationId: organization._id,
        },
      },
    ];

    if (auditsInsightsQueryInput?.walkType?.length > 0) {
      pipeline.push({
        $match: {
          walkType: { $in: auditsInsightsQueryInput.walkType },
        },
      });
    }

    if (auditsInsightsQueryInput?.auditTypesIds?.length > 0) {
      pipeline.push({
        $match: {
          auditTypeId: { $in: auditsInsightsQueryInput.auditTypesIds },
        },
      });
    }

    if (auditsInsightsQueryInput?.locationsIds?.length > 0) {
      pipeline.push({
        $match: {
          locationId: { $in: auditsInsightsQueryInput.locationsIds },
        },
      });
    }

    if (auditsInsightsQueryInput?.businessUnitsIds?.length > 0) {
      pipeline.push({
        $match: {
          businessUnitId: { $in: auditsInsightsQueryInput.businessUnitsIds },
        },
      });
    }

    if (auditsInsightsQueryInput?.usersIds?.auditorsIds?.length > 0) {
      pipeline.push({
        $match: {
          auditorId: { $in: auditsInsightsQueryInput.usersIds?.auditorsIds },
        },
      });
    }

    if (auditsInsightsQueryInput?.usersIds?.participantsIds?.length > 0) {
      pipeline.push({
        $match: {
          participantsIds: {
            $in: auditsInsightsQueryInput.usersIds?.participantsIds,
          },
        },
      });
    }

    if (auditsInsightsQueryInput?.status?.length > 0) {
      pipeline.push({
        $match: {
          status: {
            $in: auditsInsightsQueryInput.status,
          },
        },
      });
    }

    // Filter by created date or due date
    // Based on query parameter
    // Audits attribute selected conditionally to filter
    if (auditsInsightsQueryInput?.createdDate || auditsInsightsQueryInput?.dueDate) {
      const [filter, startDate, endDate] = auditsInsightsQueryInput?.createdDate || auditsInsightsQueryInput?.dueDate;
      const filterByCreatedDate = !!auditsInsightsQueryInput.createdDate;
      let $match;
      switch (filter) {
        case 'thisWeek':
          $match = {
            $and: [
              {
                [filterByCreatedDate ? 'metatags.addedAt' : 'dueDate']: {
                  $gte: startOfWeek(new Date(), { weekStartsOn: 1 }),
                },
              },
              {
                [filterByCreatedDate ? 'metatags.addedAt' : 'dueDate']: {
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
                [filterByCreatedDate ? 'metatags.addedAt' : 'dueDate']: {
                  $gte: startOfMonth(new Date()),
                },
              },
              {
                [filterByCreatedDate ? 'metatags.addedAt' : 'dueDate']: {
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
                [filterByCreatedDate ? 'metatags.addedAt' : 'dueDate']: {
                  $gte: startOfYear(new Date()),
                },
              },
              {
                [filterByCreatedDate ? 'metatags.addedAt' : 'dueDate']: {
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
                [filterByCreatedDate ? 'metatags.addedAt' : 'dueDate']: {
                  $gte: startOfMonth(addMonths(new Date(), 1)),
                },
              },
              {
                [filterByCreatedDate ? 'metatags.addedAt' : 'dueDate']: {
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
                [filterByCreatedDate ? 'metatags.addedAt' : 'dueDate']: {
                  $gte: startOfDay(new Date(startDate)),
                },
              },
              {
                [filterByCreatedDate ? 'metatags.addedAt' : 'dueDate']: {
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
                  [filterByCreatedDate ? 'metatags.addedAt' : 'dueDate']: {
                    $gte: startOfDay(new Date(startDate)),
                  },
                },
                {
                  [filterByCreatedDate ? 'metatags.addedAt' : 'dueDate']: {
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

    const audits = await Audits.aggregate(pipeline);

    let totalAudits;
    let completedAudits;
    let upcomingAudits;
    let missedAudits;
    let totalAuditsChart;
    let completedAuditsChart;
    let upcomingAuditsChart;
    let missedAuditsChart;

    if (shouldJoin(['totalAudits'])) totalAudits = audits.length;

    if (shouldJoin(['completedAudits'])) completedAudits = audits.filter((audit) => audit.status === 'completed').length;

    if (shouldJoin(['upcomingAudits'])) upcomingAudits = audits.filter((audit) => audit.status === 'upcoming').length;

    if (shouldJoin(['missedAudits'])) missedAudits = audits.filter((audit) => audit.status === 'missed').length;

    if (shouldJoin(['totalAuditsChart'])) {
      const auditsGroupedByMonth = groupBy(
        Object.entries(groupBy(audits, 'metatags.addedAt')).map(([key, value]) => ({
          date: format(new Date(key), 'MMM yy'),
          audits: (value as Array<any>).length,
        })),
        'date',
      );

      totalAuditsChart = Object.entries(auditsGroupedByMonth).reduce(
        (acc: { dates: string[]; counts: number[] }, [key, value]) => ({
          dates: [...acc?.dates, key],
          counts: [...acc?.counts, sumBy(value, 'audits')],
        }),
        { dates: [], counts: [] },
      );
    }

    if (shouldJoin(['completedAuditsChart'])) {
      const auditsGroupedByMonth = groupBy(
        Object.entries(
          groupBy(
            audits.filter((audit) => audit.status === 'completed'),
            'metatags.addedAt',
          ),
        ).map(([key, value]) => ({
          date: format(new Date(key), 'MMM yy'),
          audits: (value as Array<any>).length,
        })),
        'date',
      );

      completedAuditsChart = Object.entries(auditsGroupedByMonth).reduce(
        (acc: { dates: string[]; counts: number[] }, [key, value]) => ({
          dates: [...acc?.dates, key],
          counts: [...acc?.counts, sumBy(value, 'audits')],
        }),
        { dates: [], counts: [] },
      );
    }

    if (shouldJoin(['upcomingAuditsChart'])) {
      const auditsGroupedByDate = groupBy(
        Object.entries(
          groupBy(
            audits.filter(({ status }) => status === 'upcoming'),
            'metatags.addedAt',
          ),
        ).map(([key, value]) => ({
          date: format(new Date(key), 'MMM yy'),
          audits: (value as Array<any>).length,
        })),
        'date',
      );

      upcomingAuditsChart = Object.entries(auditsGroupedByDate).reduce(
        (acc: { dates: string[]; counts: number[] }, [key, value]) => ({
          dates: [...acc?.dates, key],
          counts: [...acc?.counts, (value as Array<any>).length],
        }),
        { dates: [], counts: [] },
      );
    }

    if (shouldJoin(['missedAuditsChart'])) {
      const auditsGroupedByDate = groupBy(
        Object.entries(
          groupBy(
            audits.filter(({ status }) => status === 'missed'),
            'metatags.addedAt',
          ),
        ).map(([key, value]) => ({
          date: format(new Date(key), 'MMM yy'),
          audits: (value as Array<any>).length,
        })),
        'date',
      );

      missedAuditsChart = Object.entries(auditsGroupedByDate).reduce(
        (acc: { dates: string[]; counts: number[] }, [key, value]) => ({
          dates: [...acc?.dates, key],
          counts: [...acc?.counts, (value as Array<any>).length],
        }),
        { dates: [], counts: [] },
      );
    }

    return {
      totalAudits,
      completedAudits,
      upcomingAudits,
      missedAudits,
      totalAuditsChart,
      completedAuditsChart,
      upcomingAuditsChart,
      missedAuditsChart,
    };
  } catch (err: any) {
    throw new Error(err);
  }
};

export default auditsInsights;
