import { RegulatoryBodies } from 'app-models';
import { isPermitted } from 'app-utils';

const createRegulatoryBody = async (
  _,
  { name },
  { authorize, organization },
) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: 'regulatoryBodies.add' }))
      throw new Error('User is not permitted');

    const createdRegulatoryBody = await RegulatoryBodies.customCreate(
      { name },
      user._id,
      organization._id,
    );
    return createdRegulatoryBody;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default createRegulatoryBody;
