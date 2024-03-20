import { Context } from '@azure/functions';
import { getDate } from 'date-fns';

import IConfig from '../common/interfaces/IConfig';
import Audits from '../common/services/collections/Audits';
import Notifications from '../common/services/collections/Notifications';
import Settings from '../common/services/collections/Settings';
import Users from '../common/services/collections/Users';
import { EmailService } from '../common/services/EmailService';
import { getEmailSubject, getEmailTemplate } from '../common/services/notifications';
import { getCircularReplacer } from '../common/utils';

const sendComingUpAudits = async (config: IConfig, context: Context) => {
  const auditsByOrganization = await Audits.aggregate([
    {
      $match: {
        'metatags.removedAt': { $eq: null },
        status: 'upcoming',
      },
    },
    {
      $lookup: {
        from: 'businessUnits',
        localField: 'areaId',
        foreignField: '_id',
        as: 'area',
      },
    },
    {
      $unwind: {
        path: '$area',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: '$organizationId',
        audits: {
          $push: {
            _id: '$_id',
            auditorId: '$auditorId',
            scope: '$scope',
            area: '$area',
          },
        },
      },
    },
    {
      $lookup: {
        from: 'organizations',
        localField: '_id',
        foreignField: '_id',
        as: 'organization',
      },
    },
    {
      $unwind: {
        path: '$organization',
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);

  await Promise.all(
    auditsByOrganization.map(async ({ audits, organization }) => {
      const auditsStatusReminderTriggerSetting = await Settings.customFindByName(
        'auditsStatusReminderTriggers',
        organization._id
      );
      const triggerDaysOfMonth = auditsStatusReminderTriggerSetting?.[0]?.value;
      if (triggerDaysOfMonth?.includes(getDate(new Date()))) {
        const emailService = new EmailService(config);

        await Promise.all(audits.map(async audit => {
          let notificationId: string;
          let notificationMetatags = {};
          try {
            const module = organization.modules.find(({ _id }) => _id === audit.scope?.moduleId);

            const emailType = 'auditUpcoming';
            const emailData = {
              areaName: audit.area?.name,
              auditPath: `${organization.domain}/${module?.path}/audits/${audit._id}`,
            };

            const auditor = await Users.customFindByIdWithDetails({
              userId: audit.auditorId,
              organization,
              config,
            });

            // Save notification in database
            const notification = await Notifications.customCreate({
              emailType,
              emailData,
              status: 'pending',
              to: [auditor?.email],
              scope: {
                moduleId: module?._id,
              },
            }, 'system', organization._id);
            notificationId = notification._id;
            notificationMetatags = notification.metatags;

            const subject = await getEmailSubject({ emailType, organization });
            const body = await getEmailTemplate({
              emailType,
              emailData,
              modulePath: module.path,
              organization,
            });

            if (auditor) {
              await emailService.sendEmail({
                to: [auditor.email],
                subject,
                body,
              });
              await Notifications.updateOne({ _id: notificationId }, {
                status: "sent",
                metatags: {
                  ...notification.metatags,
                  updatedAt: new Date(),
                },
              });
            }
          } catch (e) {
            const error = JSON.stringify({ message: e.message, response: e.response }, getCircularReplacer());
            await Notifications.updateOne({ _id: notificationId }, {
              status: "failed",
              error,
              metatags: {
                ...notificationMetatags,
                updatedAt: new Date(),
              },
            });
            context.log.error(`Upcoming audit notification failed for audit ${audit._id}.`);
            context.log.error(error);
          }
        }));
      }
    })
  );
};

export default sendComingUpAudits;
