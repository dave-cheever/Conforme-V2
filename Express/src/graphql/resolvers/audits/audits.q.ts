import { compareDesc } from 'date-fns';
import { GraphQLResolveInfo } from 'graphql';

import { Audits, Users } from 'app-models';
import { doesPathExist, getProjectFields, isPermitted, join } from 'app-utils';

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

    if (shouldJoin(['site']) || !isPermitted({ user, action: 'audits.viewAll' })) {
      join({
        pipeline,
        collection: 'locations',
        from: 'siteId',
        to: 'site',
      });
    }

    if (shouldJoin(['area']) || !isPermitted({ user, action: 'audits.viewAll' })) {
      join({
        pipeline,
        collection: 'businessUnits',
        from: 'areaId',
        to: 'area',
      });
    }

    // For "user" role filter audits
    if (!isPermitted({ user, action: 'audits.viewAll' })) {
      /**
       * User's direct reports. The user is a manager of these users.
       */
      const users = await Users.customFindWithDetails({ selector: { managerId: user._id }, organization });

      /**
       * Array of all users including the user himself and his direct reports
       */
      const userIds = [user._id, ...users.map((user) => user._id)];

      const $or: { [key: string]: string }[] = [];
      userIds.forEach((_id) => {
        $or.push(
          ...[
            {
              auditorId: _id,
            },
            {
              participantsIds: _id,
            },
            {
              'site.ownerId': _id,
            },
            {
              'area.ownerId': _id,
            },
          ],
        );
      });

      pipeline.push({
        $match: {
          $or,
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

    if (auditQueryInput?.status?.length > 0) {
      pipeline.push({
        $match: {
          status: {
            $in: auditQueryInput.status,
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

    if (shouldJoin(['numberOfActions'])) {
      pipeline.push({
        $lookup: {
          from: 'answers',
          localField: '_id',
          foreignField: 'scope._id',
          as: 'answers',
        },
      });
      pipeline.push({
        $lookup: {
          from: 'actions',
          localField: 'answers._id',
          foreignField: 'scope._id',
          as: 'actions',
        },
      });
      pipeline.push({
        $project: {
          auditorId: shouldJoin(['auditor']),
          participantsIds: shouldJoin(['participants']),
          ...getProjectFields(info.fieldNodes, 'audits'),
          metatags: 1,
          actions: 1,
        },
      });
    }

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
                      try {
                        const participant = await Users.customFindByIdWithDetails({
                          userId: id,
                          organization,
                        });

                        return participant;
                      } catch {
                        return {
                          _id: id,
                          displayName: 'Unknown',
                          imgUrl: null,
                        };
                      }
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

    if (shouldJoin(['numberOfActions'])) {
      audits = audits.map((audit) => ({
        ...audit,
        numberOfActions: audit.actions?.filter((action) => !action.metatags.removedAt)?.length ?? 0,
      }));
    }

    return audits.sort((a, b) => compareDesc(new Date(a.metatags.addedAt), new Date(b.metatags.addedAt)));
  } catch (err: any) {
    throw new Error(err);
  }
};

export default audits;
