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
  const audits = await Audits.aggregate([
    {
      $match: {
        'metatags.addedAt': { $gte: since, $lt: to }
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
  const { templateSettingName, emailSettingName } = getTemplateDetails(AUDITS_WEEKLY_SUMMARY);
  const templates = await Settings.customFindByName(templateSettingName, organizationsIds);

  templates.forEach(async template => {
    try {
      const organization = await Organizations.customFindById(template.organizationId);

      const subject = getEmailSubject(AUDITS_WEEKLY_SUMMARY);

      const audit = audits.find(({ _id }) => _id === template.organizationId);

      const body = await getEmailTemplate({
        emailType: AUDITS_WEEKLY_SUMMARY,
        emailData: {
          numberOfAudits: audit?.numberOfAudits
        },
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
