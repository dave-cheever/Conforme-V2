import { GraphQLResolveInfo } from 'graphql';

import { Actions, Users } from 'app-models';
import { doesPathExist, getProjectFields, join, priorities } from 'app-utils';

const actions = async (
  _,
  { actionQueryInput },
  { organization },
  info: GraphQLResolveInfo,
) => {
  try {
    const shouldJoin = (elements: string[]) =>
      doesPathExist(info.fieldNodes, ['actions', ...elements]);

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

    if (shouldJoin(['answer'])) {
      join({
        pipeline,
        collection: 'answers',
        from: 'scope._id',
        to: 'answer',
      });
    }

    if (shouldJoin(['answer', 'audit'])) {
      join({
        pipeline,
        collection: 'audits',
        from: 'answer.scope._id',
        to: 'answer.audit',
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

    return actions.sort(
      (a, b) => priorities[a.priority] - priorities[b.priority],
    );
  } catch (err: any) {
    throw new Error(err);
  }
};

export default actions;
