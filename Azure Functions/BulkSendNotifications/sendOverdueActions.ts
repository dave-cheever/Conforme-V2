import Actions from '../common/services/collections/Actions';
import Answers from '../common/services/collections/Answers';
import Users from '../common/services/collections/Users';
import Organizations from '../common/services/collections/Organizations';

import { GraphService } from '../common/services/GraphService';
import {
  ACTION_OVERDUE,
  getEmailSubject,
  getEmailTemplate
} from '../common/services/notifications';
import IConfig from '../common/interfaces/IConfig';

const sendOverdueActions = async (config: IConfig) => {
  const actionsByOrganization = await Actions.aggregate([
    {
      $match: {
        'metatags.removedAt': { $eq: null },
        status: 'open',
        dueDate: { $lt: new Date() }
      }
    },
    {
      $group: {
        _id: '$organizationId',
        actions: {
          $push: {
            _id: '$_id',
            title: '$title',
            assigneeId: '$assigneeId',
            dueDate: '$dueDate',
            scope: '$scope'
          }
        }
      }
    },
    {
      $lookup: {
        from: 'organizations',
        localField: '_id',
        foreignField: '_id',
        as: 'organization'
      }
    },
    {
      $unwind: {
        path: '$organization',
        preserveNullAndEmptyArrays: true
      }
    }
  ]);

  await Promise.all(
    actionsByOrganization.map(async ({ actions, organization }) => {
      await Promise.all(
        actions.map(async action => {
          const module = organization.modules.find(({ _id }) => _id === action.scope.moduleId);
          let actionPath = '';
          const recipients: string[] = [];

          if (action.assigneeId) {
            const assignee = await Users.customFindByIdWithDetails({
              userId: action.assigneeId,
              organization
            });
            if (assignee) recipients.push(assignee.email);
          }

          // If action was created in an answer, in an audit,
          if (action.scope?._id && action.scope?.type === 'answer') {
            const answers = await Answers.aggregate([
              {
                $match: {
                  $and: [
                    {
                      'metatags.removedAt': { $eq: null }
                    },
                    {
                      _id: action.scope._id,
                      'scope.type': 'audit'
                    }
                  ]
                }
              },
              {
                $lookup: {
                  from: 'audits',
                  localField: 'scope._id',
                  foreignField: '_id',
                  as: 'audit'
                }
              },
              {
                $unwind: {
                  path: '$audit',
                  preserveNullAndEmptyArrays: true
                }
              }
            ]);
            const answer = answers[0];
            if (module && answer)
              actionPath = `${organization.domain}/${module.path}/actions?id=${action._id}`;

            const auditor = await Users.customFindByIdWithDetails({
              userId: answer?.audit.auditorId,
              organization
            });
            if (auditor) recipients.push(auditor.email);
          }

          const subject = getEmailSubject(ACTION_OVERDUE, {}, module.translations);
          const body = await getEmailTemplate({
            emailType: ACTION_OVERDUE,
            emailData: {
              actionTitle: action.title,
              actionPath
            },
            modulePath : module.path,
            organization
          });
          const graphService = new GraphService(config);

          await graphService.sendDirectEmail({
            from: config.EmailSender,
            to: recipients,
            subject,
            body
          });
        })
      );
    })
  );
};

export default sendOverdueActions;
