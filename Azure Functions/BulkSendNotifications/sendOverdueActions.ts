import { isBefore } from 'date-fns';

import Actions from '../common/services/collections/Actions';
import Answers from '../common/services/collections/Answers';
import Users from '../common/services/collections/Users';
import Audits from '../common/services/collections/Audits';
import Organizations from '../common/services/collections/Organizations';

import { GraphService } from '../common/services/GraphService';
import { getEmailSubject, getEmailTemplate } from '../common/services/notifications';

const sendOverdueActions = async (emailType: number, config) => {
  const audits = await Audits.aggregate([
    {
      $match: {
        'metatags.removedAt': { $eq: null }
      }
    },
    {
      $group: {
        _id: '$organizationId',
        numberOfAudits: {
          $sum: 1
        }
      }
    }
  ]);

  const organizationsIds: string[] = audits.map(({ _id }) => _id);

  await Promise.all(
    organizationsIds.map(async organizationId => {
      const organization = await Organizations.customFindById(organizationId);
      const actions = await Actions.customFind({ done: false }, organizationId);

      await Promise.all(
        actions.map(async action => {
          if (action.dueDate && isBefore(new Date(action.dueDate), new Date())) {
            const actionAnswers = await Answers.aggregate([
              {
                $match: {
                  $and: [
                    {
                      'metatags.removedAt': { $eq: null }
                    },
                    {
                      _id: { $eq: action.scope._id }
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
                  path: `$audit`,
                  preserveNullAndEmptyArrays: true
                }
              }
            ]);

            const assignee = await Users.customFindByIdWithDetails({
              userId: action.assigneeId,
              organization
            });
            const subject = getEmailSubject(emailType);
            const body = await getEmailTemplate({
              emailType,
              emailData: {
                actionTitle: action.title,
                actionAuditId: actionAnswers?.[0]?.audit._id as string
              },
              organization
            });
            const graphService = new GraphService(config);

            if (assignee?.email) {
              await graphService.sendDirectEmail({
                from: config.EmailSender,
                to: [assignee.email, actionAnswers?.[0]?.audit.auditorId],
                subject,
                body
              });
            }
          }
        })
      );
    })
  );
};

export default sendOverdueActions;
