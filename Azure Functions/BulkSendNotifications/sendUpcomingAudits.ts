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
        const graphService = new GraphService(config);

        await Promise.all(audits.map(async audit => {
          const module = organization.modules.find(({ _id }) => _id === audit.scope?.moduleId);
          const subject = getEmailSubject(AUDIT_UPCOMING, {}, module.translations);
          const body = await getEmailTemplate({
            emailType: AUDIT_UPCOMING,
            emailData: {
              areaName: audit.area?.name,
              auditPath: `${organization.domain}/${module?.path}/audits/${audit._id}`,
            },
            modulePath: module.path,
            organization,
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
