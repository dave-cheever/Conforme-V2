import { Audits } from 'app-models';
import { isPermitted } from 'app-utils';

const createAudit = async (_, { audit }, { authorize, organization }) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: 'audits.add' }))
      throw new Error('User is not permitted');

    const reference = await Audits.customGenerateReference();
    const newAudit = {
      ...audit,
      reference,
    };

    const createdAudit = await Audits.customCreate(
      newAudit,
      user._id,
      organization._id,
    );
    return createdAudit;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default createAudit;
