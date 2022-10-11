import { Actions } from 'app-models';
import { checkActionPermission } from 'app-utils';

const createAction = async (_, { action }, { authorize, organization }) => {
  try {
    const user = await authorize();

    const isPermitted = checkActionPermission({
      user,
      action,
      organization,
      permissionAction: 'add',
    });
    if (!isPermitted) throw new Error('User is not permitted to create an action.');

    const createdAction = await Actions.customCreate(action, user._id, organization._id);

    // Assert user
    Actions.customAssertAssignee(createdAction._id);

    // resolve answer status if all actions status related to it are closed
    Actions.customResolveAnswer(createdAction?.scope?._id || '', user._id, organization);

    // Send email to assignee
    if (action.assigneeId) Actions.customAssigneeNotification(createdAction._id, organization);

    return createdAction;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default createAction;
