import { GraphQLResolveInfo } from 'graphql';

import { Actions, Answers, Audits, Responses, Users } from 'app-models';
import { doesPathExist, getActionStatus, join } from 'app-utils';

const users = async (_, { usersAnswersCountInput, usersPagination }, { organization }, info: GraphQLResolveInfo) => {
  const shouldJoin = (elements: string[]) => doesPathExist(info.fieldNodes, ['users', ...elements]);

  try {
    // Lookup all users in organisation
    let users = await Users.customFindWithDetails({ selector: {}, pagination: usersPagination, organization });

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

        if (shouldJoin(['totalActionsCount'])) {
          for (const user of users) {
            const pipeline: any[] = [
              {
                $match: {
                  'metatags.removedAt': { $eq: null },
                  organizationId: organization._id,
                },
              },
            ];

            pipeline.push({
              $match: {
                assigneeId: user._id,
              },
            });

            pipeline.push({ $count: '_id' });

            user.totalActionsCount = (await Actions.aggregate(pipeline))?.[0]?._id ?? 0;
          }
        }

        if (shouldJoin(['totalActionsCount'])) {
          for (const user of users) {
            const pipeline: any[] = [
              {
                $match: {
                  'metatags.removedAt': { $eq: null },
                  organizationId: organization._id,
                },
              },
            ];

            pipeline.push({
              $match: {
                assigneeId: user._id,
                done: true,
              },
            });

            pipeline.push({ $count: '_id' });

            user.totalActionsCount = (await Actions.aggregate(pipeline))?.[0]?._id ?? 0;
          }
        }

        if (shouldJoin(['inProgressActionsCount'])) {
          for (const user of users) {
            const pipeline: any[] = [
              {
                $match: {
                  'metatags.removedAt': { $eq: null },
                  organizationId: organization._id,
                },
              },
            ];

            pipeline.push({
              $match: {
                assigneeId: user._id,
              },
            });

            pipeline.push({ $count: '_id' });

            user.totalActionsCount =
              (await Actions.aggregate(pipeline))?.filter((action) => getActionStatus(action) === 'inProgress')?.length ?? 0;
          }
        }

        if (shouldJoin(['overdueActionsCount'])) {
          for (const user of users) {
            const pipeline: any[] = [
              {
                $match: {
                  'metatags.removedAt': { $eq: null },
                  organizationId: organization._id,
                },
              },
            ];

            pipeline.push({
              $match: {
                assigneeId: user._id,
              },
            });

            pipeline.push({ $count: '_id' });

            user.totalActionsCount =
              (await Actions.aggregate(pipeline))?.filter((action) => getActionStatus(action) === 'overdue')?.length ?? 0;
          }
        }

        if (shouldJoin(['totalAnswersCount']) && usersAnswersCountInput?.questionsCategoriesId) {
          for (const user of users) {
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
                'question.questionsCategoryId': usersAnswersCountInput.questionsCategoriesId,
                'metatags.addedBy': user._id,
              },
            });

            pipeline.push({ $count: '_id' });

            user.totalAnswersCount = (await Answers.aggregate(pipeline))?.[0]?._id ?? 0;
          }
        }

        if (shouldJoin(['openAnswersCount']) && usersAnswersCountInput?.questionsCategoriesId) {
          for (const user of users) {
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
                'question.questionsCategoryId': usersAnswersCountInput.questionsCategoriesId,
                'metatags.addedBy': user._id,
                status: 'open',
              },
            });

            pipeline.push({ $count: '_id' });

            user.openAnswersCount = (await Answers.aggregate(pipeline))?.[0]?._id ?? 0;
          }
        }

        if (shouldJoin(['resolvedAnswersCount']) && usersAnswersCountInput?.questionsCategoriesId) {
          for (const user of users) {
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
                'question.questionsCategoryId': usersAnswersCountInput.questionsCategoriesId,
                'metatags.addedBy': user._id,
                status: 'resolved',
              },
            });

            pipeline.push({ $count: '_id' });

            user.resolvedAnswersCount = (await Answers.aggregate(pipeline))?.[0]?._id ?? 0;
          }
        }

        if (shouldJoin(['closedAnswersCount']) && usersAnswersCountInput?.questionsCategoriesId) {
          for (const user of users) {
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
                'question.questionsCategoryId': usersAnswersCountInput.questionsCategoriesId,
                'metatags.addedBy': user._id,
                status: 'closed',
              },
            });

            pipeline.push({ $count: '_id' });

            user.closedAnswersCount = (await Answers.aggregate(pipeline))?.[0]?._id ?? 0;
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
