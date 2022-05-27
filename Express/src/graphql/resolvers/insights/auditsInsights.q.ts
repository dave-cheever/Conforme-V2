import { format } from 'date-fns';
import { GraphQLResolveInfo } from 'graphql';
import { groupBy, sumBy } from 'lodash';

import { Audits, Settings, Users } from 'app-models';
import { doesPathExist, getAuditStatus } from 'app-utils';

const auditsInsights = async (_, __, { authorize, organization }, info: GraphQLResolveInfo) => {
  const shouldJoin = (elements: string[]) => doesPathExist(info.fieldNodes, ['auditsInsights', ...elements]);

  try {
    await authorize();

    const audits = await Audits.find({
      'metatags.removedAt': null,
      organizationId: organization._id,
    });

    let totalAudits;
    let completedAudits;
    let upcomingAudits;
    let overdueAudits;
    let totalAuditsChart;
    let completedAuditsChart;
    let upcomingAuditsChart;
    let overdueAuditsChart;
    let topAuditors;

    if (shouldJoin(['totalAudits'])) totalAudits = audits.length;

    if (shouldJoin(['completedAudits'])) completedAudits = audits.filter((audit) => audit.status === 'completed').length;

    if (shouldJoin(['upcomingAudits'])) {
      const auditsComingUpTriggerSetting = await Settings.customFindByName('auditsComingUpTriggers', organization._id);

      upcomingAudits = audits.filter((audit) => getAuditStatus(audit, auditsComingUpTriggerSetting) === 'comingUp').length;
    }

    if (shouldJoin(['overdueAudits'])) {
      const auditsComingUpTriggerSetting = await Settings.customFindByName('auditsComingUpTriggers', organization._id);

      overdueAudits = audits.filter((audit) => getAuditStatus(audit, auditsComingUpTriggerSetting) === 'overdue').length;
    }

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
      const auditsComingUpTriggerSetting = await Settings.customFindByName('auditsComingUpTriggers', organization._id);

      const auditsGroupedByDate = groupBy(
        Object.entries(
          groupBy(
            audits.filter((audit) => getAuditStatus(audit, auditsComingUpTriggerSetting) === 'comingUp'),
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

    if (shouldJoin(['overdueAuditsChart'])) {
      const auditsComingUpTriggerSetting = await Settings.customFindByName('auditsComingUpTriggers', organization._id);

      const auditsGroupedByDate = groupBy(
        Object.entries(
          groupBy(
            audits.filter((audit) => getAuditStatus(audit, auditsComingUpTriggerSetting) === 'overdue'),
            'metatags.addedAt',
          ),
        ).map(([key, value]) => ({
          date: format(new Date(key), 'MMM yy'),
          audits: (value as Array<any>).length,
        })),
        'date',
      );

      overdueAuditsChart = Object.entries(auditsGroupedByDate).reduce(
        (acc: { dates: string[]; counts: number[] }, [key, value]) => ({
          dates: [...acc?.dates, key],
          counts: [...acc?.counts, (value as Array<any>).length],
        }),
        { dates: [], counts: [] },
      );
    }

    if (shouldJoin(['topAuditors'])) {
      topAuditors = Object.entries(groupBy(audits, 'auditorId'))
        .map(([key, value]) => ({
          _id: key,
          audits: (value as Array<any>).length,
        }))
        .sort((firstAuditor, secondAuditor) => secondAuditor.audits - firstAuditor.audits);
    }

    if (shouldJoin(['topAuditors', 'user'])) {
      topAuditors = await Promise.all(
        topAuditors.map(
          (auditor) =>
            // eslint-disable-next-line no-async-promise-executor
            new Promise<any>(async (resolve, reject) => {
              try {
                resolve({
                  ...auditor,
                  user: await Users.customFindByIdWithDetails({
                    userId: auditor?._id,
                    organization,
                  }),
                });
              } catch (e) {
                console.error(`Error occured for ${auditor?._id}: ${e}`);
                reject();
              }
            }),
        ),
      );
    }

    return {
      totalAudits,
      completedAudits,
      upcomingAudits,
      overdueAudits,
      totalAuditsChart,
      completedAuditsChart,
      upcomingAuditsChart,
      overdueAuditsChart,
      topAuditors,
    };
  } catch (err: any) {
    throw new Error(err);
  }
};

export default auditsInsights;
