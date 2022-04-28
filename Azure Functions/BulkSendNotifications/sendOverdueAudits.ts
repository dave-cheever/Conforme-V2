import Audits from '../common/services/collections/Audits';
import Organizations from '../common/services/collections/Organizations';
import Settings from '../common/services/collections/Settings';
import { GraphService } from '../common/services/GraphService';
import { getEmailSubject } from '../common/services/notifications';
import getSkeleton from '../common/services/notifications/template';
import { getAuditStatus, getTemplateDetails } from '../common/utils';

const sendOverdueAudits = async (emailType: number, config) => {
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
      const auditsComingUpTriggerSetting = await Settings.customFindByName(
        'auditsComingUpTriggers',
        organizationId
      );
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
      const overdueAudits = audits.filter(
        audit => getAuditStatus(audit, auditsComingUpTriggerSetting) === 'overdue'
      ).length;
      const { emailSettingName } = getTemplateDetails(emailType);
      const organization = await Organizations.customFindById(organizationId);
      const subject = getEmailSubject(emailType);
      const body = getSkeleton(`Number of overdue audits: ${overdueAudits}`, organization);
      const emailAddress = await Settings.customFindOneByName(emailSettingName, organizationId);
      const graphService = new GraphService(config);

      await graphService.sendDirectEmail({
        from: config.EmailSender,
        to: emailAddress.value,
        subject,
        body
      });
    })
  );
};

export default sendOverdueAudits;
