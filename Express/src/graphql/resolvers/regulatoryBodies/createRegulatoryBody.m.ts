import { v4 as uuidv4 } from 'uuid';

import { RegulatoryBodies } from 'app-models';
import { genMetatags, isPermitted } from 'app-utils';

const createRegulatoryBody = async (_, { name }, { authorize, organization }) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: 'regulatoryBodies.add' })) {
      throw new Error('User is not permitted');
    }

    const newRegulatoryBody = {
      _id: uuidv4(),
      name,
      organizationId: organization._id,
      metatags: genMetatags('added', user._id),
    };

    await RegulatoryBodies.create(newRegulatoryBody);

    return newRegulatoryBody;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default createRegulatoryBody;
