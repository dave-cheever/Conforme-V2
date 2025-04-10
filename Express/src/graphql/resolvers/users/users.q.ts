import { GraphQLResolveInfo } from 'graphql';
import { PipelineStage } from 'mongoose';

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
        user.defaultPage = Array.isArray(user.defaultPage) ? user.defaultPage : [];

        // Inject RACF count
        const getRACFCount = async (selector: object) => {
          const responses = await Responses.aggregate([
            {
              $match: {
                ...selector,
                published: true,
                organizationId: organization._id,
              },
            },
            {
              $count: 'count',
            },
          ]);
          return responses[0].count;
        }
        if (shouldJoin(['responsibleCount']))
          // eslint-disable-next-line no-param-reassign
          user.responsibleCount = await getRACFCount({ responsibleId: user._id });

        if (shouldJoin(['accountableCount']))
          // eslint-disable-next-line no-param-reassign
          user.accountableCount = await getRACFCount({ accountableId: user._id });

        if (shouldJoin(['contributorCount']))
          // eslint-disable-next-line no-param-reassign
          user.contributorCount = await getRACFCount({ contributorsIds: user._id });

        if (shouldJoin(['followerCount']))
          // eslint-disable-next-line no-param-reassign
          user.followerCount = await getRACFCount({ followersIds: user._id });

        // Inject audits count
        const getAuditsCount = async (selector: object = {}) => {
          const audits = await Audits.aggregate([
            {
              $match: {
                'metatags.removedAt': { $eq: null },
                auditorId: user._id,
                organizationId: organization._id,
                ...selector,
              },
            },
            {
              $count: 'count',
            },
          ]);
          return audits[0].count;
        }
        if (shouldJoin(['totalAuditsCount']))
          // eslint-disable-next-line no-param-reassign
          user.totalAuditsCount = await getAuditsCount();

        if (shouldJoin(['completedAuditsCount']))
          // eslint-disable-next-line no-param-reassign
          user.completedAuditsCount = await getAuditsCount({ status: 'completed' });

        if (shouldJoin(['upcomingAuditsCount']))
          // eslint-disable-next-line no-param-reassign
          user.upcomingAuditsCount = await getAuditsCount({ status: 'upcoming' });

        if (shouldJoin(['missedAuditsCount']))
          // eslint-disable-next-line no-param-reassign
          user.missedAuditsCount = await getAuditsCount({ status: 'missed' });

        // Inject actions count
        const getActionsCount = async (selector: object = {}) => {
          const pipeline: PipelineStage[] = [
            {
              $match: {
                assigneeId: user._id,
                'metatags.removedAt': { $eq: null },
                organizationId: organization._id,
                ...selector,
              },
            },
          ];
          return Actions.aggregate(pipeline);
        }

        if (shouldJoin(['totalActionsCount']))
          // eslint-disable-next-line no-param-reassign
          user.totalActionsCount = (await getActionsCount())?.length ?? 0;

        if (shouldJoin(['completedActionsCount']))
          // eslint-disable-next-line no-param-reassign
          user.completedActionsCount = (await getActionsCount({ done: true }))?.length ?? 0;

        if (shouldJoin(['inProgressActionsCount']))
          // eslint-disable-next-line no-param-reassign
          user.inProgressActionsCount = (await getActionsCount())?.filter((action) => getActionStatus(action) === 'inProgress')?.length ?? 0;

        if (shouldJoin(['overdueActionsCount']))
          // eslint-disable-next-line no-param-reassign
          user.overdueActionsCount = (await getActionsCount())?.filter((action) => getActionStatus(action) === 'overdue')?.length ?? 0;

        // Inject answers count
        if (usersAnswersCountInput?.questionsCategoriesId) {
          const getAnswersCount = async (selector: object = {}) => {
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
                'question.questionsCategoryId': usersAnswersCountInput.questionsCategoriesId,
                'metatags.addedBy': user._id,
                ...selector,
              },
            });

            pipeline.push({ $count: '_id' });
            const res = await Answers.aggregate(pipeline);
            return res?.[0]?._id ?? 0;
          }

          if (shouldJoin(['totalAnswersCount']))
            // eslint-disable-next-line no-param-reassign
            user.totalAnswersCount = await getAnswersCount();

          if (shouldJoin(['openAnswersCount']))
            // eslint-disable-next-line no-param-reassign
            user.openAnswersCount = await getAnswersCount({ status: 'open' });

          if (shouldJoin(['resolvedAnswersCount']))
            // eslint-disable-next-line no-param-reassign
            user.resolvedAnswersCount = await getAnswersCount({ status: 'resolved' });

          if (shouldJoin(['closedAnswersCount']))
            // eslint-disable-next-line no-param-reassign
            user.closedAnswersCount = await getAnswersCount({ status: 'closed' });
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
