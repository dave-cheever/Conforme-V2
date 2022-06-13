import { format } from 'date-fns';

import { Actions, Answers, Audits, Notifications, Users } from 'app-models';
import { FunctionsService } from 'app-services';
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

    if (action.scope.type === 'answer') {
      const actionAnswer = await Answers.aggregate([
        {
          $match: {
            _id: action.scope._id,
            'scope.type': 'audit',
          },
        },
        {
          $lookup: {
            from: 'audits',
            localField: 'scope._id',
            foreignField: '_id',
            as: 'audit',
          },
        },
        {
          $unwind: {
            path: `$audit`,
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);

      if (actionAnswer) {
        await Audits.customUpdateOne(
          { _id: actionAnswer?.[0]?.audit._id },
          { participantsIds: [...actionAnswer?.[0]?.audit.participantsIds, createdAction.assigneeId] },
          user._id,
          organization._id,
        );
      }
    }

    if (createdAction.assigneeId) {
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

      await FunctionsService.sendNotification(organization._id, createdNotification._id);
    }

    return createdAction;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default createAction;
