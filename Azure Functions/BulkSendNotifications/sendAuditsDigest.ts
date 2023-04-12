import { Context } from '@azure/functions';
import IConfig from '../common/interfaces/IConfig';
import Audits from '../common/services/collections/Audits';
import Notifications from '../common/services/collections/Notifications';
import Settings from '../common/services/collections/Settings';
import { EmailService } from '../common/services/EmailService';
import { getEmailSubject, getEmailTemplate } from '../common/services/notifications';

const sendDigest = async (
  {
    since,
    to,
  }: {
    since: Date;
    to: Date;
  },
  config: IConfig,
  context: Context,
) => {
  const auditsByModule = await Audits.aggregate([
    {
      $match: {
        'metatags.addedAt': { $gte: since, $lt: to }
      }
    },
    {
      $group: {
        _id: "$scope.moduleId",
        organizationId: {
          $first: "$organizationId",
        },
        audits: {
          $push: {
            _id: '$_id',
            auditorId: '$auditorId',
            scope: '$scope',
            area: '$area',
          },
        },
      }
    },
    {
      $lookup: {
        from: 'organizations',
        localField: 'organizationId',
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

  const organizationsIds: string[] = auditsByModule.map(({ organizationId }) => organizationId);
  const receivers = await Settings.customFindByName('auditsWeeklyDigestEmailAddress', organizationsIds);

  const emailService = new EmailService(config);
  auditsByModule.forEach(async ({ _id: moduleId, organization, audits }) => {
    let notificationId: string;
    try {
      const module = organization.modules.find(({ _id }) => _id === moduleId);

      const emailType = 'auditsWeeklyDigest';
      const emailData = {
        numberOfAudits: audits.length,
      };
      const subject = await getEmailSubject({ emailType, organization });
      const body = await getEmailTemplate({
        emailType,
        emailData,
        modulePath: module.path,
        organization
      });

      const receiver = receivers.find(({ organizationId }) => organizationId === organization._id);
      if (!receiver) throw new Error(`Can not find email address setting "auditsWeeklyDigestEmailAddress" for organization ${organization._id}`);

      // Save notification in database
      const notification = await Notifications.customCreate({
        emailType,
        emailData,
        status: 'pending',
        to: receiver.value,
        scope: {
          moduleId: module?._id,
        },
      }, 'system', organization._id);
      notificationId = notification._id;

      await emailService.sendEmail({
        to: receiver.value,
        subject,
        body,
      });
      await Notifications.updateOne({ _id: notificationId }, { status: "sent" });
    } catch (e) {
      const error = JSON.stringify({ message: e.message, response: e.response });
      await Notifications.updateOne({ _id: notificationId }, { error });
      context.log.error(`Audits weekly digest notification failed for module ${moduleId}.`);
      context.log.error(error);
    }
  });
};

export default sendDigest;
