import { compareDesc } from 'date-fns';
import { GraphQLResolveInfo } from 'graphql';

import { Audits, Users } from 'app-models';
import { doesPathExist, getProjectFields, join } from 'app-utils';

const audits = async (
  _,
  { auditQueryInput },
  { authorize, organization },
  info: GraphQLResolveInfo,
) => {
  const shouldJoin = (elements: string[]) =>
    doesPathExist(info.fieldNodes, ['audits', ...elements]);
  try {
    await authorize();
    const pipeline: any[] = [
      {
        $match: {
          'metatags.removedAt': { $eq: null },
          organizationId: organization._id,
        },
      },
    ];

    if (auditQueryInput?._id) {
      pipeline.push({
        $match: {
          _id: auditQueryInput._id,
        },
      });
    }

    if (shouldJoin(['auditType'])) {
      join({
        pipeline,
        collection: 'auditTypes',
        from: 'auditTypeId',
        to: 'auditType',
      });
    }

    if (shouldJoin(['site'])) {
      join({
        pipeline,
        collection: 'locations',
        from: 'siteId',
        to: 'site',
      });
    }

    if (shouldJoin(['area'])) {
      join({
        pipeline,
        collection: 'businessUnits',
        from: 'areaId',
        to: 'area',
      });
    }

    pipeline.push({ $project: getProjectFields(info.fieldNodes, 'audits') });

    let audits = await Audits.aggregate(pipeline);

    if (shouldJoin(['auditor'])) {
      audits = await Promise.all(
        audits.map(
          (audit) =>
            // eslint-disable-next-line no-async-promise-executor
            new Promise<any>(async (resolve, reject) => {
              try {
                resolve({
                  ...audit,
                  auditor: await Users.customFindByIdWithDetails({
                    userId: audit.auditorId,
                    organization,
                  }),
                });
              } catch (e) {
                console.log(`Error occured for ${audit._id}: ${e}`);
                reject();
              }
            }),
        ),
      );
    }

    if (shouldJoin(['participants'])) {
      audits = await Promise.all(
        audits.map(
          (audit) =>
            // eslint-disable-next-line no-async-promise-executor
            new Promise<any>(async (resolve, reject) => {
              try {
                if (
                  !audit?.participantsIds ||
                  audit?.participantsIds?.length === 0
                ) {
                  resolve({
                    ...audit,
                  });

                  return;
                }

                resolve({
                  ...audit,
                  participants: await Promise.all(
                    audit.participantsIds.map(async (id) => {
                      const participant = await Users.customFindByIdWithDetails(
                        {
                          userId: id,
                          organization,
                        },
                      );

                      return participant;
                    }),
                  ),
                });
              } catch (e) {
                console.log(`Error occured for ${audit._id}: ${e}`);
                reject();
              }
            }),
        ),
      );
    }

    return audits.sort((a, b) =>
      compareDesc(new Date(a.metatags.addedAt), new Date(b.metatags.addedAt)),
    );
  } catch (err: any) {
    throw new Error(err);
  }
};

export default audits;
