import { GraphQLResolveInfo } from 'graphql';

import { Actions, Answers, Audits, Locations, Responses, Users } from 'app-models';
import { doesPathExist, getActionStatus, join } from 'app-utils';

const locations = async (_, { locationQueryInput = {}, locationsAnswersCountInput }, { organization }, info: GraphQLResolveInfo) => {
  const shouldJoin = (element: string) => doesPathExist(info.fieldNodes, ['locations', element]);

  try {
    let locations = await Locations.customFind(locationQueryInput, organization._id);

    if (shouldJoin('complianceItemsResponsesCount')) {
      for (const location of locations) {
        const pipeline: any[] = [];
        join({
          pipeline,
          collection: 'trackerItems',
          from: 'complianceItemId',
          to: 'complianceItem',
        });
        pipeline.push({
          $match: {
            'complianceItem.locationsIds': { $in: [location._id] },
            'complianceItem.metatags.removedAt': { $eq: null },
            published: true,
          },
        });
        pipeline.push({
          $count: 'count',
        });
        const responses = await Responses.aggregate(pipeline);
        if (responses && responses.length > 0) location.complianceItemsResponsesCount = responses[0].count;
      }
    }

    if (shouldJoin('totalAuditsCount')) {
      for (const location of locations) {
        location.totalAuditsCount = (
          await Audits.aggregate([
            {
              $match: {
                'metatags.removedAt': { $eq: null },
                siteId: location._id,
                organizationId: organization._id,
              },
            },
            { $count: '_id' },
          ])
        )[0]._id;
      }
    }

    if (shouldJoin('completedAuditsCount')) {
      for (const location of locations) {
        location.completedAuditsCount = (
          await Audits.aggregate([
            {
              $match: {
                'metatags.removedAt': { $eq: null },
                siteId: location._id,
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
      for (const location of locations) {
        location.upcomingAuditsCount = (
          await Audits.aggregate([
            {
              $match: {
                'metatags.removedAt': { $eq: null },
                siteId: location._id,
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
      for (const location of locations) {
        location.missedAuditsCount = (
          await Audits.aggregate([
            {
              $match: {
                'metatags.removedAt': { $eq: null },
                siteId: location._id,
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
      for (const location of locations) {
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
            'answer.audit.siteId': location._id,
          },
        });

        pipeline.push({ $count: '_id' });

        location.totalActionsCount = (await Actions.aggregate(pipeline))?.[0]?._id ?? 0;
      }
    }

    if (shouldJoin('completedActionsCount')) {
      for (const location of locations) {
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
            'answer.audit.siteId': location._id,
            done: true,
          },
        });

        pipeline.push({ $count: '_id' });

        location.completedActionsCount = (await Actions.aggregate(pipeline))?.[0]?._id ?? 0;
      }
    }

    if (shouldJoin('inProgressActionsCount')) {
      for (const location of locations) {
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
            'answer.audit.siteId': location._id,
          },
        });

        location.inProgressActionsCount =
          (await Actions.aggregate(pipeline))?.filter((action) => getActionStatus(action) === 'inProgress')?.length ?? 0;
      }
    }

    if (shouldJoin('overdueActionsCount')) {
      for (const location of locations) {
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
            'answer.audit.siteId': location._id,
          },
        });

        location.overdueActionsCount =
          (await Actions.aggregate(pipeline))?.filter((action) => getActionStatus(action) === 'overdue')?.length ?? 0;
      }
    }

    if (shouldJoin('totalAnswersCount') && locationsAnswersCountInput?.questionsCategoriesId) {
      for (const location of locations) {
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
            'question.questionsCategoryId': locationsAnswersCountInput.questionsCategoriesId,
          },
        });

        pipeline.push({ $count: '_id' });

        location.totalAnswersCount = (await Answers.aggregate(pipeline))?.[0]?._id ?? 0;
      }
    }

    if (shouldJoin('openAnswersCount') && locationsAnswersCountInput?.questionsCategoriesId) {
      for (const location of locations) {
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
            'question.questionsCategoryId': locationsAnswersCountInput.questionsCategoriesId,
            status: 'open',
          },
        });

        pipeline.push({ $count: '_id' });

        location.openAnswersCount = (await Answers.aggregate(pipeline))?.[0]?._id ?? 0;
      }
    }

    if (shouldJoin('resolvedAnswersCount') && locationsAnswersCountInput?.questionsCategoriesId) {
      for (const location of locations) {
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
            'question.questionsCategoryId': locationsAnswersCountInput.questionsCategoriesId,
            status: 'resolved',
          },
        });

        pipeline.push({ $count: '_id' });

        location.resolvedAnswersCount = (await Answers.aggregate(pipeline))?.[0]?._id ?? 0;
      }
    }

    if (shouldJoin('closedAnswersCount') && locationsAnswersCountInput?.questionsCategoriesId) {
      for (const location of locations) {
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
            'question.questionsCategoryId': locationsAnswersCountInput.questionsCategoriesId,
            status: 'closed',
          },
        });

        pipeline.push({ $count: '_id' });

        location.closedAnswersCount = (await Answers.aggregate(pipeline))?.[0]?._id ?? 0;
      }
    }

    if (shouldJoin('owner')) {
      locations = await Promise.all(
        locations.map(
          async (location) => {
            try {
              if (!location.ownerId) return location;
              return {
                ...location,
                owner: await Users.customFindByIdWithDetails({
                  userId: location.ownerId,
                  organization,
                }),
              };
            } catch (e) {
              console.log(`Error occured for business unit with ID ${location._id}: ${e}`);
              return location;
            }
          },
        ),
      );
    }

    return locations?.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
};

export default locations;
