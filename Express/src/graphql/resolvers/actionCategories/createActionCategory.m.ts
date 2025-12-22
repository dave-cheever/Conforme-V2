import { ActionCategories } from 'app-models';
import { isPermitted } from 'app-utils';

const createActionCategory = async (_, { actionCategory }, { authorize, organization }) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: 'actionCategories.add' })) {
      throw new Error('User is not permitted to create an action category.');
    }

    const trimmedActionCategory = {
      ...actionCategory,
      name: actionCategory.name?.trim(),
    };

    const createdActionCategory = await ActionCategories.customCreate(
      trimmedActionCategory,
      user.userId,
      organization._id,
    );
    return createdActionCategory;
  } catch (err: any) {
    if (err.message) {
      throw new Error(err.message);
    }
    throw new Error(err);
  }
};

export default createActionCategory;

