import { format } from 'date-fns';
import FunctionService from 'src/services/function';

import { Actions, Notifications, Users } from 'app-models';
import { AUDITS_ACTION_ASSIGNED } from 'app-shared';
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
    const assignee = await Users.customFindByIdWithDetails({ userId: createdAction.assigneeId, organization });
    const createdNotification = await Notifications.customCreate(
      {
        emailType: AUDITS_ACTION_ASSIGNED,
        emailData: {
          actionTitle: createdAction.title,
          actionAuditId: createdAction.scope._id as string,
          actionDueDate: createdAction.dueDate ? `Due ${format(new Date(createdAction.dueDate), 'd LLLL Y')}` : 'No due date',
        },
        status: 'pending',
        to: [assignee?.email],
      },
      user._id,
      organization._id,
    );

    await FunctionService.sendNotification(organization._id, createdNotification._id);

    return createdAction;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default createAction;
