import { GraphQLResolveInfo } from 'graphql';

import { Audits, Responses, Users } from 'app-models';
import { doesPathExist } from 'app-utils';

const users = async (_, __, { organization }, info: GraphQLResolveInfo) => {
  const shouldJoin = (elements: string[]) => doesPathExist(info.fieldNodes, ['users', ...elements]);

  try {
    // Lookup all users in organisation
    let users = await Users.customFindWithDetails({ selector: {}, organization });

    // Lookup info for users in parallel using promise.all
    users = await Promise.all(
      users.map(async (user) => {
        if (shouldJoin(['responsibleCount'])) {
          const responses = await Responses.aggregate([
            {
              $match: {
                responsibleId: user._id,
                published: true,
                organizationId: organization._id,
              },
            },
            {
              $count: 'count',
            },
          ]);
          // eslint-disable-next-line no-param-reassign
          user.responsibleCount = responses[0].count;
        }

        if (shouldJoin(['accountableCount'])) {
          const responses = await Responses.aggregate([
            {
              $match: {
                accountableId: user._id,
                published: true,
                organizationId: organization._id,
              },
            },
            {
              $count: 'count',
            },
          ]);
          // eslint-disable-next-line no-param-reassign
          user.accountableCount = responses[0].count;
        }

        if (shouldJoin(['contributorCount'])) {
          const responses = await Responses.aggregate([
            {
              $match: {
                contributorsIds: user._id,
                published: true,
                organizationId: organization._id,
              },
            },
            {
              $count: 'count',
            },
          ]);
          // eslint-disable-next-line no-param-reassign
          user.contributorCount = responses[0].count;
        }

        if (shouldJoin(['followerCount'])) {
          const responses = await Responses.aggregate([
            {
              $match: {
                followersIds: user._id,
                published: true,
                organizationId: organization._id,
              },
            },
            {
              $count: 'count',
            },
          ]);
          // eslint-disable-next-line no-param-reassign
          user.followerCount = responses[0].count;
        }

        if (shouldJoin(['totalAuditsCount'])) {
          const audits = await Audits.aggregate([
            {
              $match: {
                'metatags.removedAt': { $eq: null },
                auditorId: user._id,
                organizationId: organization._id,
              },
            },
            {
              $count: 'count',
            },
          ]);
          // eslint-disable-next-line no-param-reassign
          user.totalAuditsCount = audits[0].count;
        }

        if (shouldJoin(['completedAuditsCount'])) {
          const audits = await Audits.aggregate([
            {
              $match: {
                'metatags.removedAt': { $eq: null },
                auditorId: user._id,
                status: 'completed',
                organizationId: organization._id,
              },
            },
            {
              $count: 'count',
            },
          ]);
          // eslint-disable-next-line no-param-reassign
          user.completedAuditsCount = audits[0].count;
        }

        if (shouldJoin(['upcomingAuditsCount'])) {
          for (const user of users) {
            user.upcomingAuditsCount = (
              await Audits.aggregate([
                {
                  $match: {
                    'metatags.removedAt': { $eq: null },
                    auditorId: user._id,
                    status: 'upcoming',
                    organizationId: organization._id,
                  },
                },
                { $count: 'count' },
              ])
            )[0].count;
          }
        }

        if (shouldJoin(['missedAuditsCount'])) {
          for (const user of users) {
            user.missedAuditsCount = (
              await Audits.aggregate([
                {
                  $match: {
                    'metatags.removedAt': { $eq: null },
                    auditorId: user._id,
                    status: 'missed',
                    organizationId: organization._id,
                  },
                },
                { $count: 'count' },
              ])
            )[0].count;
          }
        }

        return user;
      }),
    );
    return users;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default users;
