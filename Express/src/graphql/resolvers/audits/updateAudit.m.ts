import { Audits, Users } from 'app-models';
import { isPermitted } from 'app-utils';

const updateAudit = async (_, { auditInput }, { authorize, organization }) => {
  try {
    const user = await authorize();

    const audit = await Audits.customFindById(auditInput._id, organization._id);
    if (!audit) throw new Error("Audit doesn't exist");

    if (!isPermitted({ user, action: 'audits.edit', data: { audit } })) throw new Error('User is not permitted to update this audit.');

    await Users.customAssertUser({ userId: audit.auditorId, organizationId: organization._id });
    for (const participantId of audit.participantsIds)
      await Users.customAssertUser({ userId: participantId, organizationId: organization._id });

    const updatedAudit = await Audits.customUpdateOne({ _id: audit._id }, auditInput, user._id, organization._id);
    return updatedAudit;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default updateAudit;
