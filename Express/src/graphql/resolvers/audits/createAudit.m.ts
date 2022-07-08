import { isAfter, subDays } from 'date-fns';

import { Audits, AuditTypes } from 'app-models';
import { getNextRenewalDate, isPermitted } from 'app-utils';

const createAudit = async (_, { audit }, { authorize, organization }) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: 'audits.add' })) throw new Error('User is not permitted to add an audit.');

    const auditType = await AuditTypes.customFindById(audit.auditTypeId, organization._id);
    if (!auditType) throw new Error('Audit type not found');
    if (!auditType?.startingDate) throw new Error('Audit type starting date is required');

    let dueDate = subDays(auditType.startingDate, 1);
    do dueDate = getNextRenewalDate(dueDate, auditType.frequency);
    while (isAfter(new Date(), dueDate));

    const reference = await Audits.customGenerateReference();
    const newAudit = {
      ...audit,
      reference,
      status: 'upcoming',
      dueDate,
    };

    const createdAudit = await Audits.customCreate(newAudit, user._id, organization._id);

    return createdAudit;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default createAudit;
