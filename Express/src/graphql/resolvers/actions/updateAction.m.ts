import { Actions, Answers, Notifications, Users } from 'app-models';
import { FunctionsService } from 'app-services';
import { AUDITS_ACTION_COMPLETED } from 'app-shared';
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

    if (updatedAction.done) {
      const actionAnswers = await Answers.aggregate([
        {
          $match: {
            $and: [
              {
                'metatags.removedAt': { $eq: null },
              },
              {
                _id: { $eq: updatedAction.scope._id },
              },
            ],
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

      const auditor = await Users.customFindByIdWithDetails({
        userId: actionAnswers?.[0]?.audit.auditorId,
        organization,
      });

      const createdNotification = await Notifications.customCreate(
        {
          emailType: AUDITS_ACTION_COMPLETED,
          emailData: {
            actionTitle: updatedAction.title,
            actionAuditId: actionAnswers?.[0]?.audit._id as string,
          },
          status: 'pending',
          to: [auditor?.email],
        },
        user._id,
        organization._id,
      );

      await FunctionsService.sendNotification(organization._id, createdNotification._id);
    }

    return updatedAction;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default updateAction;
