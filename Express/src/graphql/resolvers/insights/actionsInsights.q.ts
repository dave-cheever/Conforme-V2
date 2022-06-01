import { format } from 'date-fns';
import { GraphQLResolveInfo } from 'graphql';
import { groupBy, sumBy } from 'lodash';

import { Actions, Users } from 'app-models';
import { doesPathExist, getActionStatus } from 'app-utils';

const actionsInsights = async (_, __, { authorize, organization }, info: GraphQLResolveInfo) => {
  const shouldJoin = (elements: string[]) => doesPathExist(info.fieldNodes, ['actionsInsights', ...elements]);

  try {
    await authorize();

    const actions = await Actions.find({
      'metatags.removedAt': null,
      organizationId: organization._id,
    });

    let totalActions;
    let completedActions;
    let inProgressActions;
    let overdueActions;
    let totalActionsChart;
    let completedActionsChart;
    let inProgressActionsChart;
    let overdueActionsChart;
    let mostAddedBy;

    if (shouldJoin(['totalActions'])) totalActions = actions.length;

    if (shouldJoin(['completedActions'])) completedActions = actions.filter((action) => action.done).length;

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
            actions.filter((action) => action.done),
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

    if (shouldJoin(['mostAddedBy'])) {
      mostAddedBy = Object.entries(groupBy(actions, 'metatags.addedBy'))
        .map(([key, value]) => ({
          _id: key,
          actions: (value as Array<any>).length,
        }))
        .sort((firstActionCreator, secondActionCreator) => secondActionCreator.actions - firstActionCreator.actions);
    }

    if (shouldJoin(['mostAddedBy', 'user'])) {
      mostAddedBy = await Promise.all(
        mostAddedBy.map(
          (user) =>
            // eslint-disable-next-line no-async-promise-executor
            new Promise<any>(async (resolve, reject) => {
              try {
                resolve({
                  ...user,
                  user: await Users.customFindByIdWithDetails({
                    userId: user?._id,
                    organization,
                  }),
                });
              } catch (e) {
                console.error(`Error occured for ${user?._id}: ${e}`);
                reject();
              }
            }),
        ),
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
      mostAddedBy,
    };
  } catch (err: any) {
    throw new Error(err);
  }
};

export default actionsInsights;
