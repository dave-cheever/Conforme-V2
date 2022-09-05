import { GraphQLResolveInfo } from 'graphql';

import { IBusinessUnit } from 'app-interfaces';
import { Actions, Answers, Audits, BusinessUnits, Responses, Users } from 'app-models';
import { doesPathExist, getActionStatus, join } from 'app-utils';

const businessUnits = async (
  _,
  { businessUnitQueryInput = {}, businessUnitsAnswersCountInput },
  { organization },
  info: GraphQLResolveInfo,
) => {
  const shouldJoin = (element: string) => doesPathExist(info.fieldNodes, ['businessUnits', element]);

  try {
    let businessUnits = await BusinessUnits.customFind(businessUnitQueryInput, organization._id);

    if (shouldJoin('trackerItemsResponsesCount')) {
      businessUnits = await Promise.all(
        businessUnits.map(
          (businessUnit) =>
            // eslint-disable-next-line no-async-promise-executor
            new Promise<IBusinessUnit>(async (res) => {
              const pipeline: any[] = [
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

              // eslint-disable-next-line no-promise-executor-return
              return res(businessUnit);
            }),
        ),
      );
    }

    if (shouldJoin('totalAuditsCount')) {
      for (const businessUnit of businessUnits) {
        businessUnit.totalAuditsCount = (
          await Audits.aggregate([
            {
              $match: {
                'metatags.removedAt': { $eq: null },
                businessUnitId: businessUnit._id,
                organizationId: organization._id,
              },
            },
            { $count: '_id' },
          ])
        )[0]._id;
      }
    }

    if (shouldJoin('completedAuditsCount')) {
      for (const businessUnit of businessUnits) {
        businessUnit.completedAuditsCount = (
          await Audits.aggregate([
            {
              $match: {
                'metatags.removedAt': { $eq: null },
                businessUnitId: businessUnit._id,
                status: 'completed',
                organizationId: organization._id,
              },
            },
            { $count: '_id' },
          ])
        )[0]._id;
      }
    }

    if (shouldJoin('upcomingAuditsCount')) {
      for (const businessUnit of businessUnits) {
        businessUnit.upcomingAuditsCount = (
          await Audits.aggregate([
            {
              $match: {
                'metatags.removedAt': { $eq: null },
                businessUnitId: businessUnit._id,
                status: 'upcoming',
                organizationId: organization._id,
              },
            },
            { $count: 'count' },
          ])
        )[0].count;
      }
    }

    if (shouldJoin('missedAuditsCount')) {
      for (const businessUnit of businessUnits) {
        businessUnit.missedAuditsCount = (
          await Audits.aggregate([
            {
              $match: {
                'metatags.removedAt': { $eq: null },
                businessUnitId: businessUnit._id,
                status: 'missed',
                organizationId: organization._id,
              },
            },
            { $count: 'count' },
          ])
        )[0].count;
      }
    }

    if (shouldJoin('totalActionsCount')) {
      for (const businessUnit of businessUnits) {
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
            'answer.audit.locationId': businessUnit._id,
          },
        });

        pipeline.push({ $count: '_id' });

        businessUnit.totalActionsCount = (await Actions.aggregate(pipeline))?.[0]?._id ?? 0;
      }
    }

    if (shouldJoin('completedActionsCount')) {
      for (const businessUnit of businessUnits) {
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
            'answer.audit.locationId': businessUnit._id,
            done: true,
          },
        });

        pipeline.push({ $count: '_id' });

        businessUnit.completedActionsCount = (await Actions.aggregate(pipeline))?.[0]?._id ?? 0;
      }
    }

    if (shouldJoin('inProgressActionsCount')) {
      for (const businessUnit of businessUnits) {
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
            'answer.audit.locationId': businessUnit._id,
          },
        });

        businessUnit.inProgressActionsCount =
          (await Actions.aggregate(pipeline))?.filter((action) => getActionStatus(action) === 'inProgress')?.length ?? 0;
      }
    }

    if (shouldJoin('overdueActionsCount')) {
      for (const businessUnit of businessUnits) {
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
            'answer.audit.locationId': businessUnit._id,
          },
        });

        businessUnit.overdueActionsCount =
          (await Actions.aggregate(pipeline))?.filter((action) => getActionStatus(action) === 'overdue')?.length ?? 0;
      }
    }

    if (shouldJoin('totalAnswersCount') && businessUnitsAnswersCountInput?.questionsCategoriesId) {
      for (const businessunit of businessUnits) {
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
            'question.questionsCategoryId': businessUnitsAnswersCountInput.questionsCategoriesId,
          },
        });

        pipeline.push({ $count: '_id' });

        businessunit.totalAnswersCount = (await Answers.aggregate(pipeline))?.[0]?._id ?? 0;
      }
    }

    if (shouldJoin('openAnswersCount') && businessUnitsAnswersCountInput?.questionsCategoriesId) {
      for (const businessunit of businessUnits) {
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
            'question.questionsCategoryId': businessUnitsAnswersCountInput.questionsCategoriesId,
            status: 'open',
          },
        });

        pipeline.push({ $count: '_id' });

        businessunit.openAnswersCount = (await Answers.aggregate(pipeline))?.[0]?._id ?? 0;
      }
    }

    if (shouldJoin('resolvedAnswersCount') && businessUnitsAnswersCountInput?.questionsCategoriesId) {
      for (const businessunit of businessUnits) {
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
            'question.questionsCategoryId': businessUnitsAnswersCountInput.questionsCategoriesId,
            status: 'resolved',
          },
        });

        pipeline.push({ $count: '_id' });

        businessunit.resolvedAnswersCount = (await Answers.aggregate(pipeline))?.[0]?._id ?? 0;
      }
    }

    if (shouldJoin('closedAnswersCount') && businessUnitsAnswersCountInput?.questionsCategoriesId) {
      for (const businessunit of businessUnits) {
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
            'question.questionsCategoryId': businessUnitsAnswersCountInput.questionsCategoriesId,
            status: 'closed',
          },
        });

        pipeline.push({ $count: '_id' });

        businessunit.closedAnswersCount = (await Answers.aggregate(pipeline))?.[0]?._id ?? 0;
      }
    }

    if (shouldJoin('owner')) {
      businessUnits = await Promise.all(
        businessUnits.map(
          async (businessUnit) => {
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
          },
        ),
      );
    }

    return businessUnits.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err: any) {
    throw new Error(err);
  }
};

export default businessUnits;
