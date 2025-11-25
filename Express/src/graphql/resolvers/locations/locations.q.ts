import { GraphQLResolveInfo } from 'graphql';
import { PipelineStage } from 'mongoose';

import { Actions, Answers, Audits, Locations, Responses, Users } from 'app-models';
import { doesPathExist, getActionStatus, join } from 'app-utils';

const locations = async (
  _,
  { moduleId, locationsAnswersCountInput, locationsPagination },
  { organization },
  info: GraphQLResolveInfo,
) => {
  const shouldJoin = (element: string) => doesPathExist(info.fieldNodes, ['locations', element]);

  try {
    let locations = await Locations.customFind(moduleId && { 'scope.moduleId': moduleId } , organization._id, locationsPagination);

    if (shouldJoin('trackerItemsResponsesCount')) {
      for (const location of locations) {
        const pipeline: PipelineStage[] = [];
        join({
          pipeline,
          collection: 'trackerItems',
          from: 'trackerItemId',
          to: 'trackerItem',
        });
        pipeline.push({
          $match: {
            'trackerItem.locationsIds': { $in: [location._id] },
            'trackerItem.metatags.removedAt': { $eq: null },
            published: true,
          },
        });
        pipeline.push({
          $count: 'count',
        });
        const responses = await Responses.aggregate(pipeline);
        if (responses && responses.length > 0) location.trackerItemsResponsesCount = responses[0].count;
      }
    }

    if (shouldJoin('totalAuditsCount')) {
      for (const location of locations) {
        location.totalAuditsCount = (
          await Audits.aggregate([
            {
              $match: {
                'metatags.removedAt': { $eq: null },
                locationId: location._id,
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
                locationId: location._id,
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
                locationId: location._id,
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
                locationId: location._id,
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
            'answer.audit.locationId': location._id,
          },
        });

        pipeline.push({ $count: '_id' });

        location.totalActionsCount = (await Actions.aggregate(pipeline))?.[0]?._id ?? 0;
      }
    }

    if (shouldJoin('completedActionsCount')) {
      for (const location of locations) {
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
            'answer.audit.locationId': location._id,
            done: true,
          },
        });

        pipeline.push({ $count: '_id' });

        location.completedActionsCount = (await Actions.aggregate(pipeline))?.[0]?._id ?? 0;
      }
    }

    if (shouldJoin('inProgressActionsCount')) {
      for (const location of locations) {
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
            'answer.audit.locationId': location._id,
          },
        });

        location.inProgressActionsCount =
          (await Actions.aggregate(pipeline))?.filter((action) => getActionStatus(action) === 'inProgress')?.length ?? 0;
      }
    }

    if (shouldJoin('overdueActionsCount')) {
      for (const location of locations) {
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
            'answer.audit.locationId': location._id,
          },
        });

        location.overdueActionsCount =
          (await Actions.aggregate(pipeline))?.filter((action) => getActionStatus(action) === 'overdue')?.length ?? 0;
      }
    }

    if (locationsAnswersCountInput?.questionsCategoriesId) {
      const getAnswersCount = async (locationId: string, selector: object = {}) => {
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
            'question.questionsCategoryId': locationsAnswersCountInput.questionsCategoriesId,
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
            'audit.locationId': locationId,
          },
        });

        pipeline.push({ $count: '_id' });
        const res = await Answers.aggregate(pipeline);
        return res?.[0]?._id ?? 0;
      }
      if (shouldJoin('totalAnswersCount'))
        for (const location of locations) location.totalAnswersCount = await getAnswersCount(location._id);

      if (shouldJoin('openAnswersCount'))
        for (const location of locations) location.openAnswersCount = await getAnswersCount(location._id, { status: 'open' });

      if (shouldJoin('resolvedAnswersCount'))
        for (const location of locations) location.resolvedAnswersCount = await getAnswersCount(location._id, { status: 'resolved' });

      if (shouldJoin('closedAnswersCount'))
        for (const location of locations) location.closedAnswersCount = await getAnswersCount(location._id, { status: 'closed' });
    }

    if (shouldJoin('owner')) {
      locations = await Promise.all(
        locations.map(async (location) => {
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
        }),
      );
    }

    // Remove duplicates - keep the first occurrence based on name (or _id as fallback)
    const uniqueLocationsMap = new Map<string, typeof locations[0]>();
    locations.forEach((location) => {
      if (!location) return;
      const uniqueKey = location.name || location._id;
      if (uniqueKey && !uniqueLocationsMap.has(uniqueKey)) {
        uniqueLocationsMap.set(uniqueKey, location);
      }
    });

    return Array.from(uniqueLocationsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
};

export default locations;
