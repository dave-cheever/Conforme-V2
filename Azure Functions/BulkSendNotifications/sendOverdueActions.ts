import { Context } from '@azure/functions';

import Actions from '../common/services/collections/Actions';
import Answers from '../common/services/collections/Answers';
import Users from '../common/services/collections/Users';
import { getEmailSubject, getEmailTemplate } from '../common/services/notifications';
import IConfig from '../common/interfaces/IConfig';
import { EmailService } from '../common/services/EmailService';
import Notifications from '../common/services/collections/Notifications';

const sendOverdueActions = async (config: IConfig, context: Context) => {
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

  const emailService = new EmailService(config);
  await Promise.all(
    actionsByOrganization.map(async ({ actions, organization }) => {
      await Promise.all(
        actions.map(async action => {
          let notificationId: string;
          try {
            const module = organization.modules.find(({ _id }) => _id === action.scope.moduleId);
            let actionPath = '';
            const recipients: string[] = [];

            if (action.assigneeId) {
              const assignee = await Users.customFindByIdWithDetails({
                userId: action.assigneeId,
                organization,
                config,
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
                organization,
                config,
              });
              if (auditor) recipients.push(auditor.email);
            }

            const emailType = 'actionOverdue';
            const emailData = {
              actionTitle: action.title,
              actionPath
            };
            const subject = await getEmailSubject({ emailType, organization });
            const body = await getEmailTemplate({
              emailType,
              emailData,
              modulePath: module.path,
              organization,
            });

            // Save notification in database
            const notification = await Notifications.customCreate({
              emailType,
              emailData,
              status: 'pending',
              to: recipients,
              scope: {
                moduleId: module?._id,
              },
            }, 'system', organization._id);
            notificationId = notification._id;

            await emailService.sendEmail({
              to: recipients,
              subject,
              body,
            });
            await Notifications.updateOne({ _id: notificationId }, { status: "sent" });
          } catch (e) {
            const error = JSON.stringify({ message: e.message, response: e.response });
            await Notifications.updateOne({ _id: notificationId }, { error });
            context.log.error(`Overdue notification failed for action ${action._id}.`);
            context.log.error(error);
          }
        })
      );
    })
  );
};

export default sendOverdueActions;
