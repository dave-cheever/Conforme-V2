import { AuditTypes } from 'app-models';
import { isPermitted } from 'app-utils';

const createAuditType = async (_, { auditType }, { authorize, organization }) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: 'auditTypes.add' })) throw new Error('User is not permitted to create an audit type.');

    const createdAuditType = await AuditTypes.customCreate(auditType, user.userId, organization._id);
    return createdAuditType;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default createAuditType;
