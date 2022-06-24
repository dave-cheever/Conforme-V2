import { endOfDay, startOfDay } from 'date-fns';

import IConfig from '../common/interfaces/IConfig';
import Audits from '../common/services/collections/Audits';
import Organizations from '../common/services/collections/Organizations';
import Settings from '../common/services/collections/Settings';
import Users from '../common/services/collections/Users';
import { GraphService } from '../common/services/GraphService';
import { AUDIT_MISSED, getEmailSubject, getEmailTemplate } from '../common/services/notifications';
import { getTemplateDetails } from '../common/utils';

const sendMissedAudits = async (config: IConfig) => {
  const auditsByOrganization = await Audits.aggregate([
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
        path: `$area`,
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
  ]);

  await Promise.all(
    auditsByOrganization.map(async ({ _id: organizationId, audits }) => {
      const graphService = new GraphService(config);
      const organization = await Organizations.customFindById(organizationId);
      const { emailSettingName } = getTemplateDetails(AUDIT_MISSED);
      const subject = getEmailSubject(AUDIT_MISSED);

      await Promise.all(audits.map(async audit => {
        const module = organization.modules.find(({ _id }) => _id === audit.scope?.moduleId);
        const body = await getEmailTemplate({
          emailType: AUDIT_MISSED,
          emailData: {
            areaName: audit.area?.name,
            auditPath: `${organization.domain}/${module?.path}/audits/${audit._id}`,
          },
          organization
        });

        let recipients: string[] = [];
        const emailAddress = await Settings.customFindOneByName(emailSettingName, organizationId);
        if (emailAddress) recipients = emailAddress.value;

        const auditor = await Users.customFindByIdWithDetails({
          userId: audit.auditorId,
          organization,
        });
        if (auditor) recipients.push(auditor.email);

        if (auditor.managerId) {
          const lineManager = await Users.customFindByIdWithDetails({
            userId: auditor.managerId,
            organization,
          });
          if (lineManager) recipients.push(lineManager.email);
        }

        await graphService.sendDirectEmail({
          from: config.EmailSender,
          to: recipients,
          subject,
          body
        });
      }));
    })
  );
};

export default sendMissedAudits;
