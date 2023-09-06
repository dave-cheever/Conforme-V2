import { GraphQLResolveInfo } from 'graphql';
import { PipelineStage } from 'mongoose';

import { Actions, Answers, Audits, BusinessUnits, Responses, Users } from 'app-models';
import { doesPathExist, getActionStatus, join } from 'app-utils';

const businessUnits = async (
  _,
  { businessUnitQueryInput = {}, businessUnitsAnswersCountInput, businessUnitsPagination },
  { organization },
  info: GraphQLResolveInfo,
) => {
  const shouldJoin = (element: string) => doesPathExist(info.fieldNodes, ['businessUnits', element]);

  try {
    let businessUnits = await BusinessUnits.customFind(businessUnitQueryInput, organization._id, businessUnitsPagination);

    businessUnits = await Promise.all(
      businessUnits.map(async (businessUnit) => {
        if (shouldJoin('trackerItemsResponsesCount')) {
          // eslint-disable-next-line no-async-promise-executor
          const pipeline: PipelineStage[] = [
            {
              $match: {
                businessUnitId: businessUnit._id,
              },
            },
          ];
          join({
            pipeline,
            collection: 'trackerItems',
            from: 'trackerItemId',
            to: 'trackerItem',
          });
          pipeline.push({
            $match: {
              'trackerItem.metatags.removedAt': { $eq: null },
              published: true,
            },
          });
          pipeline.push({
            $count: 'count',
          });
          const responses = await Responses.aggregate(pipeline);
          if (responses && responses.length > 0)
            // eslint-disable-next-line no-param-reassign
            businessUnit.trackerItemsResponsesCount = responses[0].count;
        }

        // Inject audits count
        const getAuditsCount = async (selector: object = {}) => {
          const audits = await Audits.aggregate([
            {
              $match: {
                'metatags.removedAt': { $eq: null },
                businessUnitId: businessUnit._id,
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

        if (shouldJoin('totalAuditsCount'))
          // eslint-disable-next-line no-param-reassign
          businessUnit.totalAuditsCount = await getAuditsCount();

        if (shouldJoin('completedAuditsCount'))
          // eslint-disable-next-line no-param-reassign
          businessUnit.completedAuditsCount = await getAuditsCount({ status: 'completed' });

        if (shouldJoin('upcomingAuditsCount'))
          // eslint-disable-next-line no-param-reassign
          businessUnit.upcomingAuditsCount = await getAuditsCount({ status: 'upcoming' });

        if (shouldJoin('missedAuditsCount'))
          // eslint-disable-next-line no-param-reassign
          businessUnit.missedAuditsCount = await getAuditsCount({ status: 'missed' });

        // Inject actions count
        const getActionsCount = async (selector: object = {}) => {
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
            collection: 'answers',
            from: 'scope._id',
            to: 'answer',
          });
          join({
            pipeline,
            collection: 'audits',
            from: 'answer.scope._id',
            to: 'answer.audit',
          });

          pipeline.push({
            $match: {
              $or: [
                {
                  'answer.businessUnitId': businessUnit._id,
                  ...selector,
                },
                {
                  'answer.audit.businessUnitId': businessUnit._id,
                  ...selector,
                },
              ],
            },
          });

          return Actions.aggregate(pipeline);
        };

        if (shouldJoin('totalActionsCount'))
          // eslint-disable-next-line no-param-reassign
          businessUnit.totalActionsCount = (await getActionsCount())?.length ?? 0;

        if (shouldJoin('completedActionsCount'))
          // eslint-disable-next-line no-param-reassign
          businessUnit.completedActionsCount = (await getActionsCount({ done: true }))?.length ?? 0;

        if (shouldJoin('inProgressActionsCount'))
          // eslint-disable-next-line no-param-reassign
          businessUnit.inProgressActionsCount = (await getActionsCount())?.filter((action) => getActionStatus(action) === 'inProgress')?.length ?? 0;

        if (shouldJoin('overdueActionsCount'))
          // eslint-disable-next-line no-param-reassign
          businessUnit.overdueActionsCount = (await getActionsCount())?.filter((action) => getActionStatus(action) === 'overdue')?.length ?? 0;

        // Inject answers stats
        if (businessUnitsAnswersCountInput?.questionsCategoriesId) {
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
                'question.questionsCategoryId': businessUnitsAnswersCountInput.questionsCategoriesId,
                ...selector,
              },
            });

            join({
              pipeline,
              collection: 'audits',
              from: 'scope._id',
              to: 'audit',
            });
            pipeline.push({
              $match: {
                $or: [
                  { 'businessUnitId': businessUnit._id },
                  { 'audit.businessUnitId': businessUnit._id },
                ],
              },
            });

            pipeline.push({ $count: '_id' });
            const res = await Answers.aggregate(pipeline);
            return res?.[0]?._id ?? 0;
          }

          if (shouldJoin('totalAnswersCount'))
            // eslint-disable-next-line no-param-reassign
            businessUnit.totalAnswersCount = await getAnswersCount();

          if (shouldJoin('openAnswersCount'))
            // eslint-disable-next-line no-param-reassign
            businessUnit.openAnswersCount = await getAnswersCount({ status: 'open' });

          if (shouldJoin('resolvedAnswersCount'))
            // eslint-disable-next-line no-param-reassign
            businessUnit.resolvedAnswersCount = await getAnswersCount({ status: 'resolved' });

          if (shouldJoin('closedAnswersCount'))
            // eslint-disable-next-line no-param-reassign
            businessUnit.closedAnswersCount = await getAnswersCount({ status: 'closed' });
        } else if (shouldJoin('totalAnswersCount')) {
          const answers = await Answers.aggregate([
            {
              $match: {
                'metatags.removedAt': { $eq: null },
                businessUnitId: businessUnit._id,
                organizationId: organization._id,
              },
            },
            {
              $count: 'count',
            },
          ]);

          // eslint-disable-next-line no-param-reassign
          businessUnit.totalAnswersCount = answers[0].count;
        }

        if (shouldJoin('owner')) {
          try {
            if (!businessUnit.ownerId) return businessUnit;
            return {
              ...businessUnit,
              owner: await Users.customFindByIdWithDetails({
                userId: businessUnit.ownerId,
                organization,
              }),
            };
          } catch (e) {
            console.log(`Error occured for business unit with ID ${businessUnit._id}: ${e}`);
            return businessUnit;
          }
        }

        return businessUnit;
      }),
    );

    return businessUnits.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err: any) {
    throw new Error(err);
  }
};

export default businessUnits;
