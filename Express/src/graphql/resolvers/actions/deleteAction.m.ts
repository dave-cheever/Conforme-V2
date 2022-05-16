import { Actions } from 'app-models';
import { checkActionPermission } from 'app-utils';

const deleteAction = async (_, { _id }, { authorize, organization }) => {
  try {
    const user = await authorize();

    const action = await Actions.customFindById(_id, organization._id);
    if (!action) throw new Error("Action doesn't exist");

    const isPermitted = checkActionPermission({
      user,
      action,
      organization,
      permissionAction: 'delete',
    });
    if (!isPermitted) throw new Error('User is not permitted to delete this action.');

    const deletedResult = await Actions.customDelete({ _id }, user._id, organization._id);
    return deletedResult;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default deleteAction;
