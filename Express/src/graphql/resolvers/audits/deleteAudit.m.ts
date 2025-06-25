import { Audits } from 'app-models';
import { isPermitted } from 'app-utils';

const deleteAudit = async (_, { _id }, { authorize, organization }) => {
  try {
    const user = await authorize();

    const audit = await Audits.customFindById(_id, organization._id);
    if (!audit) throw new Error("Audit doesn't exist");

    if (!isPermitted({ user, action: 'audits.delete', data: { audit } })) throw new Error('User is not permitted to delete this audit.');

    const deletedResult = await Audits.customDelete({ _id }, user.userId, organization._id);
    return deletedResult;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default deleteAudit;
