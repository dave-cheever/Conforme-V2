import { Audits } from 'app-models';
import { isPermitted } from 'app-utils';

const submitAudit = async (_, { auditId }, { authorize, organization }) => {
  try {
    const user = await authorize();

    const audit = await Audits.customFindById(auditId, organization._id);
    if (!audit) throw new Error("Audit doesn't exist");

    if (!isPermitted({ user, action: 'audits.edit', data: { audit } })) throw new Error('User is not permitted to update this audit.');

    await Audits.customUpdateOne({ _id: audit._id }, { status: 'completed', completedDate: new Date() }, user._id, organization._id);

    return true;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default submitAudit;
