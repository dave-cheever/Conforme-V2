import { AuditTypes } from 'app-models';
import { isPermitted } from 'app-utils';

const deleteAuditType = async (_, { _id }, { authorize, organization }) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: 'auditTypes.delete' })) throw new Error('User is not permitted to delete this audit type.');

    const deletedResult = await AuditTypes.customDelete({ _id }, user.userId, organization._id);
    return deletedResult;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default deleteAuditType;
