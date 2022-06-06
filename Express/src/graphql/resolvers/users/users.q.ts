import { GraphQLResolveInfo } from 'graphql';

import { IUser } from 'app-interfaces';
import { Audits, Responses, Users } from 'app-models';
import { GraphService } from 'app-services';
import { doesPathExist, getProtocol } from 'app-utils';

const users = async (_, __, { organization }, info: GraphQLResolveInfo) => {
  const shouldJoin = (elements: string[]) => doesPathExist(info.fieldNodes, ['users', ...elements]);

  try {
    // Lookup all users in organisation
    const users: IUser[] = await Users.customFind({ organization }, organization._id);
    const usersWithDetails: IUser[] = [];

    // Lookup info for users in parallel using promise.all
    await Promise.all(
      users.map(async (user) => {
        const userDetails = await GraphService.getUserData({
          userId: user._id,
          organization,
        });
        if (shouldJoin(['role'])) {
          // eslint-disable-next-line no-param-reassign
          user.role = 'user';

          const roles: any = await GraphService.checkMemberGroups({
            userId: user._id,
            groups: {
              admin: organization.adminsGroupId || '',
              reader: organization.readersGroupId || '',
            },
            organization,
          });

          if (roles.admin)
            // eslint-disable-next-line no-param-reassign
            user.role = 'admin';
          else if (roles.reader)
            // eslint-disable-next-line no-param-reassign
            user.role = 'reader';
        }

        if (shouldJoin(['imgUrl'])) {
          // eslint-disable-next-line no-param-reassign
          user.imgUrl = `${getProtocol()}${process.env.API_URL}/files/photo/${user._id}`;
        }

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

        usersWithDetails.push({
          ...user,
          firstName: userDetails?.givenName || '',
          lastName: userDetails?.surname || '',
          displayName: userDetails?.displayName || '',
          email: userDetails?.mail || userDetails?.userPrincipalName || '',
          jobTitle: userDetails?.jobTitle || '',
        });
      }),
    );
    return usersWithDetails;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default users;
