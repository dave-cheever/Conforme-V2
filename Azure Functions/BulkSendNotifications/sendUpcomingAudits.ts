import { getDate } from 'date-fns';

import IConfig from '../common/interfaces/IConfig';
import Audits from '../common/services/collections/Audits';
import Organizations from '../common/services/collections/Organizations';
import Settings from '../common/services/collections/Settings';
import Users from '../common/services/collections/Users';
import { GraphService } from '../common/services/GraphService';
import { AUDIT_UPCOMING, getEmailSubject, getEmailTemplate } from '../common/services/notifications';

const sendComingUpAudits = async (config: IConfig) => {
  const auditsByOrganization = await Audits.aggregate([
    {
      $match: {
        'metatags.removedAt': { $eq: null },
        status: 'upcoming',
        organizationId: "underio"
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
      const auditsStatusReminderTriggerSetting = await Settings.customFindByName(
        'auditsStatusReminderTriggers',
        organizationId
      );
      const triggerDaysOfMonth = auditsStatusReminderTriggerSetting?.[0]?.value;
      if (triggerDaysOfMonth?.includes(getDate(new Date()))) {
        const graphService = new GraphService(config);
        const organization = await Organizations.customFindById(organizationId);
        const subject = getEmailSubject(AUDIT_UPCOMING);

        await Promise.all(audits.map(async audit => {
          const module = organization.modules.find(({ _id }) => _id === audit.scope?.moduleId);
          const body = await getEmailTemplate({
            emailType: AUDIT_UPCOMING,
            emailData: {
              areaName: audit.area?.name,
              auditPath: `/${module?.path}/audits/${audit._id}`,
            },
            organization
          });

          const auditor = await Users.customFindByIdWithDetails({
            userId: audit.auditorId,
            organization,
          });
          if (auditor) {
            await graphService.sendDirectEmail({
              from: config.EmailSender,
              to: [auditor.email],
              subject,
              body
            });
          }
        }));
      }
    })
  );
};

export default sendComingUpAudits;
