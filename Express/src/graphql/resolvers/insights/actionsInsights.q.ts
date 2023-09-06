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

import { Actions } from 'app-models';
import { doesPathExist, getActionStatus } from 'app-utils';

const actionsInsights = async (_, { actionsInsightsQueryInput }, { authorize, organization }, info: GraphQLResolveInfo) => {
  const shouldJoin = (elements: string[]) => doesPathExist(info.fieldNodes, ['actionsInsights', ...elements]);

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

    if (actionsInsightsQueryInput?.scope) {
      pipeline.push({
        $match: Object.entries(actionsInsightsQueryInput.scope).reduce((acc, [key, value]) => {
          acc[`scope.${key}`] = value;
          return acc;
        }, {}),
      });
    }

    if (actionsInsightsQueryInput?.status?.length > 0) {
      const statusQueries = actionsInsightsQueryInput.status.map((status) => {
        if (status === 'overdue') {
          return {
            status: 'open',
            dueDate: {
              $lt: new Date(),
            },
          };
        }
        return {
          status,
        };
      });
      pipeline.push({
        $match: {
          $or: statusQueries,
        },
      });
    }

    if (actionsInsightsQueryInput?.priority?.length > 0) {
      pipeline.push({
        $match: {
          priority: { $in: actionsInsightsQueryInput.priority },
        },
      });
    }

    if (actionsInsightsQueryInput?.usersIds?.assigneesIds?.length > 0) {
      pipeline.push({
        $match: {
          assigneeId: {
            $in: actionsInsightsQueryInput.usersIds?.assigneesIds?.map((assigneeId: string) =>
              assigneeId === 'unassigned' ? null : assigneeId,
            ),
          },
        },
      });
    }

    // Filter by due date
    if (actionsInsightsQueryInput?.dueDate) {
      const [filter, startDate, endDate] = actionsInsightsQueryInput?.dueDate;
      let $match;
      switch (filter) {
        case 'thisWeek':
          $match = {
            $and: [
              {
                dueDate: {
                  $gte: startOfWeek(new Date(), { weekStartsOn: 1 }),
                },
              },
              {
                dueDate: {
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
                dueDate: {
                  $gte: startOfMonth(new Date()),
                },
              },
              {
                dueDate: {
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
                dueDate: {
                  $gte: startOfYear(new Date()),
                },
              },
              {
                dueDate: {
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
                dueDate: {
                  $gte: startOfMonth(addMonths(new Date(), 1)),
                },
              },
              {
                dueDate: {
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
                dueDate: {
                  $gte: startOfDay(new Date(startDate)),
                },
              },
              {
                dueDate: {
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
                  dueDate: {
                    $gte: startOfDay(new Date(startDate)),
                  },
                },
                {
                  dueDate: {
                    $lte: endOfDay(new Date(endDate)),
                  },
                },
              ],
            };
          }
          break;
        case 'overdue':
          $match = { dueDate: { $lt: new Date() } };
          break;
        default:
          break;
      }

      if ($match) pipeline.push({ $match });
    }

    if (actionsInsightsQueryInput?.locationsIds?.length > 0) {
      pipeline.push({
        $match: {
          'answer.audit.locationId': { $in: actionsInsightsQueryInput.locationsIds },
        },
      });
    }

    if (actionsInsightsQueryInput?.businessUnitsIds?.length > 0) {
      pipeline.push({
        $match: {
          'answer.audit.businessUnitId': { $in: actionsInsightsQueryInput.businessUnitsIds },
        },
      });
    }

    const actions = await Actions.aggregate(pipeline);

    let totalActions;
    let completedActions;
    let inProgressActions;
    let overdueActions;
    let totalActionsChart;
    let completedActionsChart;
    let inProgressActionsChart;
    let overdueActionsChart;

    if (shouldJoin(['totalActions'])) totalActions = actions.length;

    if (shouldJoin(['completedActions'])) completedActions = actions.filter((action) => action.status === 'closed').length;

    if (shouldJoin(['inProgressActions'])) inProgressActions = actions.filter((action) => getActionStatus(action) === 'inProgress').length;

    if (shouldJoin(['overdueActions'])) overdueActions = actions.filter((action) => getActionStatus(action) === 'overdue').length;

    if (shouldJoin(['totalActionsChart'])) {
      const actionsGroupedByMonth = groupBy(
        Object.entries(groupBy(actions, 'metatags.addedAt')).map(([key, value]) => ({
          date: format(new Date(key), 'MMM yy'),
          actions: (value as Array<any>).length,
        })),
        'date',
      );

      totalActionsChart = Object.entries(actionsGroupedByMonth).reduce(
        (acc: { dates: string[]; counts: number[] }, [key, value]) => ({
          dates: [...acc?.dates, key],
          counts: [...acc?.counts, sumBy(value, 'actions')],
        }),
        { dates: [], counts: [] },
      );
    }

    if (shouldJoin(['completedActionsChart'])) {
      const actionsGroupedByMonth = groupBy(
        Object.entries(
          groupBy(
            actions.filter((action) => action.status === 'closed'),
            'metatags.addedAt',
          ),
        ).map(([key, value]) => ({
          date: format(new Date(key), 'MMM yy'),
          actions: (value as Array<any>).length,
        })),
        'date',
      );

      completedActionsChart = Object.entries(actionsGroupedByMonth).reduce(
        (acc: { dates: string[]; counts: number[] }, [key, value]) => ({
          dates: [...acc?.dates, key],
          counts: [...acc?.counts, sumBy(value, 'actions')],
        }),
        { dates: [], counts: [] },
      );
    }

    if (shouldJoin(['inProgressActionsChart'])) {
      const actionsGroupedByDate = groupBy(
        Object.entries(
          groupBy(
            actions.filter((action) => getActionStatus(action) === 'inProgress'),
            'metatags.addedAt',
          ),
        ).map(([key, value]) => ({
          date: format(new Date(key), 'MMM yy'),
          actions: (value as Array<any>).length,
        })),
        'date',
      );

      inProgressActionsChart = Object.entries(actionsGroupedByDate).reduce(
        (acc: { dates: string[]; counts: number[] }, [key, value]) => ({
          dates: [...acc?.dates, key],
          counts: [...acc?.counts, (value as Array<any>).length],
        }),
        { dates: [], counts: [] },
      );
    }

    if (shouldJoin(['overdueActionsChart'])) {
      const actionsGroupedByDate = groupBy(
        Object.entries(
          groupBy(
            actions.filter((audit) => getActionStatus(audit) === 'overdue'),
            'metatags.addedAt',
          ),
        ).map(([key, value]) => ({
          date: format(new Date(key), 'MMM yy'),
          actions: (value as Array<any>).length,
        })),
        'date',
      );

      overdueActionsChart = Object.entries(actionsGroupedByDate).reduce(
        (acc: { dates: string[]; counts: number[] }, [key, value]) => ({
          dates: [...acc?.dates, key],
          counts: [...acc?.counts, (value as Array<any>).length],
        }),
        { dates: [], counts: [] },
      );
    }

    return {
      totalActions,
      completedActions,
      inProgressActions,
      overdueActions,
      totalActionsChart,
      completedActionsChart,
      inProgressActionsChart,
      overdueActionsChart,
    };
  } catch (err: any) {
    throw new Error(err);
  }
};

export default actionsInsights;
