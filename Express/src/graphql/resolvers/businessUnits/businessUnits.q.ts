import { GraphQLResolveInfo } from 'graphql';

import { IBusinessUnit } from 'app-interfaces';
import { Audits, BusinessUnits, Responses, Settings, Users } from 'app-models';
import { doesPathExist, getAuditStatus, join } from 'app-utils';

const businessUnits = async (_, { businessUnitQueryInput = {} }, { organization }, info: GraphQLResolveInfo) => {
  const shouldJoin = (element: string) => doesPathExist(info.fieldNodes, ['businessUnits', element]);

  try {
    let businessUnits = await BusinessUnits.customFind(businessUnitQueryInput, organization._id);

    if (shouldJoin('complianceItemsResponsesCount')) {
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
                collection: 'complianceItems',
                from: 'complianceItemId',
                to: 'complianceItem',
              });
              pipeline.push({
                $match: {
                  'complianceItem.metatags.removedAt': { $eq: null },
                  published: true,
                },
              });
              pipeline.push({
                $count: 'count',
              });
              const responses = await Responses.aggregate(pipeline);
              if (responses && responses.length > 0)
                // eslint-disable-next-line no-param-reassign
                businessUnit.complianceItemsResponsesCount = responses[0].count;

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
                areaId: businessUnit._id,
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
                areaId: businessUnit._id,
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

      for (const businessUnit of businessUnits) {
        businessUnit.upcomingAuditsCount = (
          await Audits.aggregate([
            {
              $match: {
                'metatags.removedAt': { $eq: null },
                areaId: businessUnit._id,
                organizationId: organization._id,
              },
            },
          ])
        ).filter((audit) => getAuditStatus(audit, auditsComingUpTriggerSetting) === 'comingUp').length;
      }
    }

    if (shouldJoin('overdueAuditsCount')) {
      const auditsComingUpTriggerSetting = await Settings.customFindByName('auditsComingUpTriggers', organization._id);

      for (const businessUnit of businessUnits) {
        businessUnit.overdueAuditsCount = (
          await Audits.aggregate([
            {
              $match: {
                'metatags.removedAt': { $eq: null },
                areaId: businessUnit._id,
                organizationId: organization._id,
              },
            },
          ])
        ).filter((audit) => getAuditStatus(audit, auditsComingUpTriggerSetting) === 'overdue').length;
      }
    }

    if (shouldJoin('owner')) {
      await Promise.all(
        businessUnits.map(
          (businessUnit) =>
            // eslint-disable-next-line no-async-promise-executor
            new Promise<void>(async (resolve, reject) => {
              try {
                // eslint-disable-next-line no-param-reassign
                businessUnit.owner = await Users.customFindByIdWithDetails({
                  userId: businessUnit.ownerId,
                  organization,
                });
                resolve();
              } catch (e) {
                console.log(`Error occured for ${businessUnit._id}: ${e}`);
                reject();
              }
            }),
        ),
      );
    }

    return businessUnits.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err: any) {
    throw new Error(err);
  }
};

export default businessUnits;
