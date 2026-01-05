import { ActionTemplates } from 'app-models';
import { isPermitted } from 'app-utils';

const createActionTemplate = async (_, { actionTemplate }, { authorize, organization }) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: 'actionTemplates.add' })) {
      throw new Error('User is not permitted to create an action template.');
    }

    const trimmedActionTemplate = {
      ...actionTemplate,
      title: actionTemplate.title?.trim(),
    };

    const createdActionTemplate = await ActionTemplates.customCreate(
      trimmedActionTemplate,
      user.userId,
      organization._id,
    );
    
    return createdActionTemplate;
  } catch (err: any) {
    if (err.message) {
      throw new Error(err.message);
    }
    throw new Error(err);
  }
};

export default createActionTemplate;

