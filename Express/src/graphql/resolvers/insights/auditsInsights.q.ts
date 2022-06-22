import { format } from 'date-fns';
import { GraphQLResolveInfo } from 'graphql';
import { groupBy, sumBy } from 'lodash';

import { Audits, Users } from 'app-models';
import { doesPathExist } from 'app-utils';

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
    let missedAudits;
    let totalAuditsChart;
    let completedAuditsChart;
    let upcomingAuditsChart;
    let missedAuditsChart;
    let topAuditors;

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
          async (auditor) => {
            try {
              return {
                ...auditor,
                user: await Users.customFindByIdWithDetails({
                  userId: auditor?._id,
                  organization,
                }),
              };
            } catch (e) {
              console.error(`Error occured in audits insights for user with ID ${auditor?._id}: ${e}`);
              return { auditor };
            }
          },
        ),
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
      topAuditors,
    };
  } catch (err: any) {
    throw new Error(err);
  }
};

export default auditsInsights;
