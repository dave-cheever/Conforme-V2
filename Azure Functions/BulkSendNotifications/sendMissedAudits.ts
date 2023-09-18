import { Context } from '@azure/functions';
import { endOfDay, startOfDay } from 'date-fns';
import { IAudit } from '../common/interfaces/IAudit';

import IConfig from '../common/interfaces/IConfig';
import { IOrganization } from '../common/interfaces/IOrganization';
import Audits from '../common/services/collections/Audits';
import Notifications from '../common/services/collections/Notifications';
import Settings from '../common/services/collections/Settings';
import Users from '../common/services/collections/Users';
import { EmailService } from '../common/services/EmailService';
import { getEmailSubject, getEmailTemplate } from '../common/services/notifications';

const sendMissedAudits = async (config: IConfig, context: Context) => {
  const auditsByOrganization: {
    _id: string; // Organization ID,
    organization: IOrganization;
    audits: IAudit[];
  }[] = await Audits.aggregate([
    {
      $match: {
        'metatags.removedAt': { $eq: null },
        status: 'missed',
        $and: [{
          completedDate: {
            $gt: startOfDay(new Date()),
          }
        }, {
          completedDate: {
            $lt: endOfDay(new Date()),
          }
        }],
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

  const emailService = new EmailService(config);
  await Promise.all(
    auditsByOrganization.map(async ({ audits, organization }) => {
      let notificationId: string;
      await Promise.all(audits.map(async audit => {
        try {
          const module = organization.modules.find(({ _id }) => _id === audit.scope?.moduleId);

          const emailType = 'auditMissed';
          const emailData = {
            areaName: audit.area?.name,
            auditPath: `${organization.domain}/${module?.path}/audits/${audit._id}`,
          };
          const subject = await getEmailSubject({ emailType, organization });
          const body = await getEmailTemplate({
            emailType,
            emailData,
            modulePath: module.path,
            organization
          });

          let recipients: string[] = [];
          const emailAddress = await Settings.customFindOneByName('auditMissedEmailAddress', organization._id);
          if (emailAddress) recipients = emailAddress.value;

          const auditor = await Users.customFindByIdWithDetails({
            userId: audit.auditorId,
            organization,
            config,
          });
          if (auditor) recipients.push(auditor.email);

          if (auditor.managerId) {
            const lineManager = await Users.customFindByIdWithDetails({
              userId: auditor.managerId,
              organization,
              config,
            });
            if (lineManager) recipients.push(lineManager.email);
          }

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
          context.log.error(`Missed audit notification failed for audit ${audit._id}.`);
          context.log.error(error);
        }
      }));
    })
  );
};

export default sendMissedAudits;
