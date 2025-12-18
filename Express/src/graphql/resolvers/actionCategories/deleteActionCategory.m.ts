import { ActionCategories } from 'app-models';
import { isPermitted } from 'app-utils';

const deleteActionCategory = async (_, { _id }, { authorize, organization }) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: 'actionCategories.delete' })) throw new Error('User is not permitted to delete this action category.');

    const deletedResult = await ActionCategories.customDelete({ _id }, user.userId, organization._id);
    return deletedResult > 0;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default deleteActionCategory;

