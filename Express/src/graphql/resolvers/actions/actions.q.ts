import { GraphQLResolveInfo } from 'graphql';

import { Actions, Users } from 'app-models';
import { doesPathExist, getProjectFields, join, priorities } from 'app-utils';

const actions = async (_, { actionQueryInput }, { authorize, organization }, info: GraphQLResolveInfo) => {
  const shouldJoin = (elements: string[]) => doesPathExist(info.fieldNodes, ['actions', ...elements]);
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

    if (actionQueryInput?._id) {
      pipeline.push({
        $match: {
          _id: actionQueryInput._id,
        },
      });
    }

    if (actionQueryInput?.scope?.component) {
      pipeline.push({
        $match: {
          'scope.component': actionQueryInput.scope.component,
        },
      });
    }

    if (actionQueryInput?.scope?.type) {
      pipeline.push({
        $match: {
          'scope.type': actionQueryInput.scope.type,
        },
      });
    }

    if (actionQueryInput?.scope?._id) {
      pipeline.push({
        $match: {
          'scope._id': actionQueryInput.scope._id,
        },
      });
    }

    if (actionQueryInput?.status?.length === 1) {
      pipeline.push({
        $match: {
          done: actionQueryInput.status[0] === 'completed',
        },
      });
    }

    if (actionQueryInput?.usersIds?.assigneesIds?.length > 0) {
      pipeline.push({
        $match: {
          assigneeId: { $in: actionQueryInput.usersIds?.assigneesIds },
        },
      });
    }

    if (shouldJoin(['answer']) || user.role === 'user') {
      join({
        pipeline,
        collection: 'answers',
        from: 'scope._id',
        to: 'answer',
      });
    }

    if (shouldJoin(['answer', 'audit']) || user.role === 'user') {
      join({
        pipeline,
        collection: 'audits',
        from: 'answer.scope._id',
        to: 'answer.audit',
      });
    }

    // For "user" role filter actions
    if (user.role === 'user') {
      pipeline.push({
        $match: {
          $or: [
            {
              'answer.audit.auditorId': user._id,
            },
            {
              'answer.audit.participantsIds': user._id,
            },
            {
              assigneeId: user._id,
            },
          ],
        },
      });
    }

    if (shouldJoin(['answer', 'audit', 'auditType'])) {
      join({
        pipeline,
        collection: 'auditTypes',
        from: 'answer.audit.auditTypeId',
        to: 'answer.audit.auditType',
      });
    }

    if (shouldJoin(['answer', 'audit', 'area'])) {
      join({
        pipeline,
        collection: 'businessUnits',
        from: 'answer.audit.areaId',
        to: 'answer.audit.area',
      });
    }

    if (shouldJoin(['answer', 'question'])) {
      join({
        pipeline,
        collection: 'questions',
        from: 'answer.questionId',
        to: 'answer.question',
      });
    }

    if (actionQueryInput?.sitesIds?.length > 0) {
      pipeline.push({
        $match: {
          'answer.audit.siteId': { $in: actionQueryInput.sitesIds },
        },
      });
    }

    if (actionQueryInput?.areasIds?.length > 0) {
      pipeline.push({
        $match: {
          'answer.audit.areaId': { $in: actionQueryInput.areasIds },
        },
      });
    }

    pipeline.push({ $project: getProjectFields(info.fieldNodes, 'actions') });
    let actions = await Actions.aggregate(pipeline);

    if (shouldJoin(['assignee'])) {
      actions = await Promise.all(
        actions.map(
          (action) =>
            // eslint-disable-next-line no-async-promise-executor
            new Promise<any>(async (resolve, reject) => {
              try {
                resolve({
                  ...action,
                  assignee: await Users.customFindByIdWithDetails({
                    userId: action?.assigneeId,
                    organization,
                  }),
                });
              } catch (e) {
                console.log(`Error occured for ${action._id}: ${e}`);
                reject();
              }
            }),
        ),
      );
    }

    return actions.sort((a, b) => priorities[a.priority] - priorities[b.priority]);
  } catch (err: any) {
    throw new Error(err);
  }
};

export default actions;
