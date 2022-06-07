import { getDate } from 'date-fns';
import Audits from '../common/services/collections/Audits';
import Organizations from '../common/services/collections/Organizations';
import Settings from '../common/services/collections/Settings';
import { GraphService } from '../common/services/GraphService';
import { getEmailSubject } from '../common/services/notifications';
import getSkeleton from '../common/services/notifications/template';
import { getTemplateDetails } from '../common/utils';

const sendComingUpAudits = async (emailType: number, config) => {
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
      const auditsStatusReminderTriggerSetting = await Settings.customFindByName(
        'auditsStatusReminderTriggers',
        organizationId
      );
      const auditsComingUpTriggerSetting = await Settings.customFindByName(
        'auditsComingUpTriggers',
        organizationId
      );
      const triggerDaysOfMonth = auditsStatusReminderTriggerSetting?.[0]?.value;

      if (triggerDaysOfMonth?.includes(getDate(new Date()))) {
        const pipeline: any[] = [
          {
            $match: {
              'metatags.removedAt': { $eq: null },
              organizationId
            }
          },
          {
            $lookup: {
              from: 'auditTypes',
              localField: 'auditTypeId',
              foreignField: '_id',
              as: 'auditType'
            }
          },
          {
            $unwind: {
              path: '$auditType',
              preserveNullAndEmptyArrays: true
            }
          }
        ];

        const audits = await Audits.aggregate(pipeline);
        const comingUpAudits = audits.filter(({ status }) => status === 'upcoming').length;
        const { emailSettingName } = getTemplateDetails(emailType);
        const organization = await Organizations.customFindById(organizationId);
        const subject = getEmailSubject(emailType);
        const body = getSkeleton(`Number of coming up audits: ${comingUpAudits}`, organization);
        const emailAddress = await Settings.customFindOneByName(emailSettingName, organizationId);
        const graphService = new GraphService(config);

        await graphService.sendDirectEmail({
          from: config.EmailSender,
          to: emailAddress.value,
          subject,
          body
        });
      }
    })
  );
};

export default sendComingUpAudits;
