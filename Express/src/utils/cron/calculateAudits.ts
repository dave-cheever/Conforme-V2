import { isAfter, subDays } from 'date-fns';

import { IAudit, TFrequency } from 'app-interfaces';
import { Audits, AuditTypes, Organizations } from 'app-models';
import { getNextRenewalDate } from 'app-utils';

const shouldCalculate = (dueDate: Date, frequency: TFrequency, windowInDays = 1) => {
  if (frequency === 'Monthly') {
    const today = new Date();
    const normalizeDate = (date: Date) => new Date(date.setHours(0, 0, 0, 0));
    const windowStartDate = subDays(today, windowInDays);
    const normalizedToday = normalizeDate(today);
    const normalizedWindowStartDate = normalizeDate(windowStartDate);
    const normalizedDueDate = normalizeDate(dueDate);
    return normalizedDueDate.getTime() >= normalizedWindowStartDate.getTime() && normalizedDueDate.getTime() <= normalizedToday.getTime();
  }
  return false;
};

const calculateAudits = async () => {
  const allowedDomains: string[] = process.env.ALLOWED_DOMAINS?.split(';') || [];
  const organizations = await Organizations.find({ domain: { $in: allowedDomains } }).lean();
  for (const organization of organizations) {
    const auditTypes = await AuditTypes.customFind({}, organization._id);
    const safetyWalkModule: any = organization.modules.find((module) => module.name === 'Safety Walk');
    const isSafetyWalkEnabled = safetyWalkModule?.featureFlags?.enableSafetyWalk;

    await Promise.all(
      auditTypes.map(async (auditType) => {
        const auditQuery: Record<string, any> = { auditTypeId: auditType._id };
        if (isSafetyWalkEnabled) auditQuery.walkType = 'physical';
        const audits = await Audits.customFind(auditQuery, organization._id);
        // Update not completed audits to missed
        audits
          .filter(({ status, dueDate }) => {
            const dueDateObj = new Date(dueDate);
            return status === 'upcoming' && isAfter(new Date(), dueDateObj) && shouldCalculate(dueDateObj, auditType.frequency);
          })
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
          .filter(({ status }) => status !== 'missed')
          .sort(({ dueDate: a }, { dueDate: b }) => new Date(b!).getTime() - new Date(a!).getTime())
          .reduce((acc, item) => {
            if (!acc.some((audit) => audit.businessUnitId === item.businessUnitId)) acc.push(item);
            return acc;
          }, [] as IAudit[]);
        for (const audit of upcomingAudits) {
          if (audit.recurring) {
            const newAudit: Record<string, any> = {
              auditTypeId: auditType._id,
              reference: await Audits.customGenerateReference(organization._id, audit.scope.moduleId),
              status: 'upcoming',
              dueDate: getNextRenewalDate(audit.dueDate, auditType.frequency),
              locationId: audit.locationId,
              businessUnitId: audit.businessUnitId,
              auditorId: audit.auditorId,
              participantsIds: [],
              recurring: auditType.recurring,
              scope: audit.scope,
            };
            if (isSafetyWalkEnabled) newAudit.walkType = 'physical';
            await Audits.customCreate(
              newAudit,
              audit.metatags.addedBy,
              organization._id,
            );
          }
        }
      }),
    );
  }
};

export default calculateAudits;
