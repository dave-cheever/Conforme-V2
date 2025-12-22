import { ActionCategories } from 'app-models';
import { isPermitted } from 'app-utils';

const updateActionCategory = async (_, { actionCategoryInput }, { authorize, organization }) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: 'actionCategories.edit' })) {
      throw new Error('User is not permitted to update this action category.');
    }

    const actionCategory = await ActionCategories.customFindById(actionCategoryInput._id, organization._id);
    if (!actionCategory) {
      throw new Error("Action category doesn't exist");
    }

    if (actionCategory.organizationId !== organization._id) {
      throw new Error("Action category doesn't exist");
    }

    const updatedActionCategory = await ActionCategories.customUpdateOne(
      { _id: actionCategory._id },
      actionCategoryInput,
      user.userId,
      organization._id,
    );
    return updatedActionCategory;
  } catch (err: any) {
    if (err.message) {
      throw new Error(err.message);
    }
    throw new Error(err);
  }
};

export default updateActionCategory;

