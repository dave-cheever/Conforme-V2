import { Actions } from 'app-models';
import { checkActionPermission } from 'app-utils';

const updateAction = async (_, { actionInput }, { authorize, organization }) => {
  try {
    const user = await authorize();

    const action = await Actions.customFindById(actionInput._id, organization._id);
    if (!action) throw new Error("Action doesn't exist");

    const isPermitted = checkActionPermission({
      user,
      action,
      organization,
      permissionAction: 'edit',
    });
    if (!isPermitted) throw new Error('User is not permitted to update this action.');

    const updatedAction = await Actions.customUpdateOne({ _id: action._id }, actionInput, user._id, organization._id);
    return updatedAction;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default updateAction;
