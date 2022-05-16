import { compareDesc } from 'date-fns';
import { GraphQLResolveInfo } from 'graphql';

import { Audits, Users } from 'app-models';
import { doesPathExist, getProjectFields, join } from 'app-utils';

const audits = async (_, { auditQueryInput }, { authorize, organization }, info: GraphQLResolveInfo) => {
  const shouldJoin = (elements: string[]) => doesPathExist(info.fieldNodes, ['audits', ...elements]);
  try {
    const user = await authorize();
    const pipeline: any[] = [
      {
        $match: {
          'metatags.removedAt': { $eq: null },
          organizationId: organization._id,
        },
      },
    ];

    // For "user" role filter audits
    if (user.role === 'user') {
      pipeline.push({
        $match: {
          $or: [
            {
              auditorId: user._id,
            },
            {
              participantsIds: user._id,
            },
          ],
        },
      });
    }

    if (auditQueryInput?._id) {
      pipeline.push({
        $match: {
          _id: auditQueryInput._id,
        },
      });
    }

    if (auditQueryInput?.status?.length > 0) {
      pipeline.push({
        $match: {
          status: { $in: auditQueryInput.status },
        },
      });
    }

    if (auditQueryInput?.walkType?.length > 0) {
      pipeline.push({
        $match: {
          walkType: { $in: auditQueryInput.walkType },
        },
      });
    }

    if (auditQueryInput?.auditTypesIds?.length > 0) {
      pipeline.push({
        $match: {
          auditTypeId: { $in: auditQueryInput.auditTypesIds },
        },
      });
    }

    if (auditQueryInput?.sitesIds?.length > 0) {
      pipeline.push({
        $match: {
          siteId: { $in: auditQueryInput.sitesIds },
        },
      });
    }

    if (auditQueryInput?.areasIds?.length > 0) {
      pipeline.push({
        $match: {
          areaId: { $in: auditQueryInput.areasIds },
        },
      });
    }

    if (auditQueryInput?.usersIds?.auditorsIds?.length > 0) {
      pipeline.push({
        $match: {
          auditorId: { $in: auditQueryInput.usersIds?.auditorsIds },
        },
      });
    }

    if (auditQueryInput?.usersIds?.participantsIds?.length > 0) {
      pipeline.push({
        $match: {
          participantsIds: {
            $in: auditQueryInput.usersIds?.participantsIds,
          },
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

    if (shouldJoin(['questions'])) {
      pipeline.push({
        $lookup: {
          from: 'questions',
          localField: '_id',
          foreignField: 'scope._id',
          as: 'questions',
        },
      });
    }

    pipeline.push({
      $project: {
        auditorId: shouldJoin(['auditor']),
        participantsIds: shouldJoin(['participants']),
        ...getProjectFields(info.fieldNodes, 'audits'),
        metatags: 1,
      },
    });

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
                if (!audit?.participantsIds || audit?.participantsIds?.length === 0) {
                  resolve({
                    ...audit,
                  });

                  return;
                }

                resolve({
                  ...audit,
                  participants: await Promise.all(
                    audit.participantsIds.map(async (id) => {
                      const participant = await Users.customFindByIdWithDetails({
                        userId: id,
                        organization,
                      });

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

    return audits.sort((a, b) => compareDesc(new Date(a.metatags.addedAt), new Date(b.metatags.addedAt)));
  } catch (err: any) {
    throw new Error(err);
  }
};

export default audits;
