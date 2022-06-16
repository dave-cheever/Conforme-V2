import { getDate } from 'date-fns';

import { IAudit, TFrequency } from 'app-interfaces';
import { Audits, AuditTypes, Organizations } from 'app-models';
import { getNextRenewalDate } from 'app-utils';

const shouldCalculate = (startDate: Date, frequency: TFrequency) => {
  // If today is start day then calculate
  return true;
  if (frequency === 'Monthly') return getDate(new Date()) === getDate(startDate);
};

const calculateAudits = async () => {
  const allowedDomains: string[] = process.env.ALLOWED_DOMAINS?.split(';') || [];
  const organizations = await Organizations.find({ domain: { $in: allowedDomains } }).lean();
  for (const organization of organizations) {
    const auditTypes = await AuditTypes.customFind({}, organization._id);

    await Promise.all(
      auditTypes.map(async (auditType) => {
        if (!shouldCalculate(auditType.startingDate, auditType.frequency)) return;

        const audits = await Audits.customFind({ auditTypeId: auditType._id, walkType: 'physical' }, organization._id);

        // Update not completed audits to missed
        audits
          .filter(({ status }) => status === 'upcoming')
          .forEach(async (audit) => {
            await Audits.customUpdateOne(
              { _id: audit._id },
              { ...audit, status: 'missed', completedDate: new Date() },
              audit.metatags.updatedBy || audit.metatags.addedBy,
              organization._id,
            );
          });

        // Create upcoming audits
        const upcomingAudits = audits
          // Get upcoming and completed audits
          .filter(({ status }) => status !== 'missed')
          // Sort by submission date to get the latest
          .sort(({ completedDate: a }, { completedDate: b }) => new Date(b!).getTime() - new Date(a!).getTime())
          // Get the first one per area
          .reduce((acc, item) => {
            if (!acc.some((audit) => audit.areaId === item.areaId)) acc.push(item);
            return acc;
          }, [] as IAudit[]);
        for (const audit of upcomingAudits) {
          await Audits.customCreate(
            {
              auditTypeId: auditType._id,
              reference: await Audits.customGenerateReference(),
              status: 'upcoming',
              dueDate: getNextRenewalDate(audit.dueDate, auditType.frequency),
              walkType: 'physical',
              siteId: audit.siteId,
              areaId: audit.areaId,
              auditorId: audit.auditorId,
              participantsIds: [],
            },
            audit.metatags.addedBy,
            organization._id,
          );
        }
      }),
    );
  }
};

export default calculateAudits;
