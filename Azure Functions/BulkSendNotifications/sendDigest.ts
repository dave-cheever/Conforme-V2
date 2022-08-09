import IConfig from '../common/interfaces/IConfig';
import Audits from '../common/services/collections/Audits';
import Organizations from '../common/services/collections/Organizations';
import Settings from '../common/services/collections/Settings';
import { GraphService } from '../common/services/GraphService';
import { AUDITS_WEEKLY_SUMMARY, getEmailSubject, getEmailTemplate } from '../common/services/notifications';
import { getTemplateDetails } from '../common/utils';

const sendDigest = async (
  {
    since,
    to,
  }: {
    since: Date;
    to: Date;
  },
  config: IConfig
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
  const { templateSettingName, emailSettingName } = getTemplateDetails(AUDITS_WEEKLY_SUMMARY);
  const templates = await Settings.customFindByName(templateSettingName, organizationsIds);

  auditsByModule.forEach(async ({ _id: moduleId, organization, audits }) => {
    try {
      const module = organization.modules.find(({ _id }) => _id === moduleId);
      const subject = getEmailSubject(AUDITS_WEEKLY_SUMMARY, {}, module.translations);
      const template = templates.find(({ organizationId }) => organizationId === organization._id);

      const body = await getEmailTemplate({
        emailType: AUDITS_WEEKLY_SUMMARY,
        emailData: {
          numberOfAudits: audits.length,
        },
        modulePath : module.path,
        template: template.value,
        organization
      });

      const emailAddress = await Settings.customFindOneByName(emailSettingName, organizationsIds);

      const graphService = new GraphService(config);
      await graphService.sendDirectEmail({
        from: config.EmailSender,
        to: emailAddress.value,
        subject,
        body
      });
    } catch (e) {
      console.log(e);
    }
  });
};

export default sendDigest;
