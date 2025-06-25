import { Settings } from 'app-models';
import { isPermitted } from 'app-utils';

const settings = async (_, { type, moduleId }, { authorize, organization }) => {
  try {
    const user = await authorize();
    if (!isPermitted({ user, action: 'settings.view' }))
      throw new Error('User is not permitted');
    if (!organization) throw new Error('User is not permitted');
    const selector: any = {};
    if (type) selector.type = type;
    if (moduleId) selector['scope.moduleId'] = moduleId;
    const settings = await Settings.customFind(selector, organization._id);
    return settings;
  } catch (err) {
    throw new Error(err as string);
  }
};

export default settings;
