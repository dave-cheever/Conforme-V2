import { Audits } from 'app-models';
import { isPermitted } from 'app-utils';

const updateAudit = async (_, { auditInput }, { authorize, organization }) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: 'audits.edit', data: auditInput }))
      throw new Error('User is not permitted');

    const audit = await Audits.customFindById(auditInput._id, organization._id);
    if (!audit) throw new Error("Audit doesn't exist");

    const updatedAudit = await Audits.customUpdateOne(
      { _id: audit._id },
      auditInput,
      user._id,
      organization._id,
    );
    return updatedAudit;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default updateAudit;
