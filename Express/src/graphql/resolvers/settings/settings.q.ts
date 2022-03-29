import { Settings } from 'app-models';
import { isPermitted } from 'app-utils';

const settings = async (_, { type }, { authorize, organization }) => {
  try {
    const user = await authorize();
    if (!isPermitted({ user, action: 'settings.view' }))
      throw new Error('User is not permitted');

    if (!organization) throw new Error('User is not permitted');

    const settings = await Settings.customFindByType(type, organization._id);
    return settings;
  } catch (err) {
    throw new Error(err as string);
  }
};

export default settings;
