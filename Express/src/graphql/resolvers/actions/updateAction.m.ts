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

    const updatedAction = await Actions.customUpdateOne({ _id: action._id }, {
      ...actionInput,
      assigneeId: actionInput.assigneeId || null,
    }, user._id, organization._id);

    // Assert user
    Actions.customAssertAssignee(action._id);

    // Sent notification if action was reassigned
    if (actionInput.assigneeId && actionInput.assigneeId !== action.assigneeId)
      Actions.customAssigneeNotification(action._id, organization);

    // Send notification if action was completed and close walk-item if all actions related to it is closed
    if (updatedAction.status === 'closed') {
      Actions.customResolveAnswer(action?.scope?._id || '', user._id, organization);
      Actions.customCompletedNotification(action._id, organization);
    }

    return updatedAction;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default updateAction;
