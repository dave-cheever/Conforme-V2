import { endOfDay, startOfDay } from 'date-fns';
import { IAudit } from '../common/interfaces/IAudit';

import IConfig from '../common/interfaces/IConfig';
import { IOrganization } from '../common/interfaces/IOrganization';
import Audits from '../common/services/collections/Audits';
import Settings from '../common/services/collections/Settings';
import Users from '../common/services/collections/Users';
import { EmailService } from '../common/services/EmailService';
import { AUDIT_MISSED, getEmailSubject, getEmailTemplate } from '../common/services/notifications';
import { getTemplateDetails } from '../common/utils';

const sendMissedAudits = async (config: IConfig) => {
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

  await Promise.all(
    auditsByOrganization.map(async ({ audits, organization }) => {
      const emailService = new EmailService(config);
      const { emailSettingName } = getTemplateDetails(AUDIT_MISSED);

      await Promise.all(audits.map(async audit => {
        const module = organization.modules.find(({ _id }) => _id === audit.scope?.moduleId);
        const subject = getEmailSubject(AUDIT_MISSED, {}, module.translations);
        const body = await getEmailTemplate({
          emailType: AUDIT_MISSED,
          emailData: {
            areaName: audit.area?.name,
            auditPath: `${organization.domain}/${module?.path}/audits/${audit._id}`,
          },
          modulePath: module.path,
          organization
        });

        let recipients: string[] = [];
        const emailAddress = await Settings.customFindOneByName(emailSettingName, organization._id);
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

        await emailService.sendEmail({
          to: recipients,
          subject,
          body,
        });
      }));
    })
  );
};

export default sendMissedAudits;
