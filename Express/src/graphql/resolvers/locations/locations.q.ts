import { GraphQLResolveInfo } from 'graphql';

import { Audits, Locations, Responses, Settings, Users } from 'app-models';
import { doesPathExist, getAuditStatus, join } from 'app-utils';

const locations = async (_, { locationQueryInput = {} }, { organization }, info: GraphQLResolveInfo) => {
  const shouldJoin = (element: string) => doesPathExist(info.fieldNodes, ['locations', element]);

  try {
    const locations = await Locations.customFind(locationQueryInput, organization._id);

    if (shouldJoin('complianceItemsResponsesCount')) {
      for (const location of locations) {
        const pipeline: any[] = [];
        join({
          pipeline,
          collection: 'complianceItems',
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
      const auditsComingUpTriggerSetting = await Settings.customFindByName('auditsComingUpTriggers', organization._id);

      for (const location of locations) {
        location.upcomingAuditsCount = (
          await Audits.aggregate([
            {
              $match: {
                'metatags.removedAt': { $eq: null },
                siteId: location._id,
                organizationId: organization._id,
              },
            },
          ])
        ).filter((audit) => getAuditStatus(audit, auditsComingUpTriggerSetting) === 'comingUp').length;
      }
    }

    if (shouldJoin('overdueAuditsCount')) {
      const auditsComingUpTriggerSetting = await Settings.customFindByName('auditsComingUpTriggers', organization._id);

      for (const location of locations) {
        location.overdueAuditsCount = (
          await Audits.aggregate([
            {
              $match: {
                'metatags.removedAt': { $eq: null },
                siteId: location._id,
                organizationId: organization._id,
              },
            },
          ])
        ).filter((audit) => getAuditStatus(audit, auditsComingUpTriggerSetting) === 'overdue').length;
      }
    }

    if (shouldJoin('owner')) {
      for (const location of locations) {
        try {
          location.owner = await Users.customFindByIdWithDetails({
            userId: location.ownerId,
            organization,
          });
        } catch (e) {
          console.log(`Error occured for ${location._id}: ${e}`);
        }
      }
    }

    return locations?.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err: any) {
    throw new Error(err);
  }
};

export default locations;
