import { IResponse } from 'app-interfaces';
import { Responses } from 'app-models';
import { isPermitted } from 'app-utils';

const updateResponse = async (
  _,
  { updateResponseModify },
  { authorize, organization },
) => {
  try {
    const user = await authorize();
    const { _id, dueDate, accountableId, responsibleId, contributorsIds, followersIds } = updateResponseModify;

    const response = await Responses.findOne({
      _id,
      organizationId: organization._id,
    });
    if (!response) throw new Error("Response doesn't exist");

    if (!isPermitted({ user, action: 'responses.edit', data: { response } }))
      throw new Error('User is not permitted');

    const update: Partial<IResponse> = {};
    if (dueDate !== undefined) update.dueDate = dueDate ? new Date(dueDate) : null;

    if (accountableId) {
      if (!isPermitted({
        user,
        action: 'responses.manageAccountable',
        data: { response },
      })
      ) throw new Error('User is not permitted to set accountable');
      update.accountableId = accountableId;
    }

    if (responsibleId) {
      if (!isPermitted({
        user,
        action: 'responses.manageResponsible',
        data: { response },
      })
      ) throw new Error('User is not permitted to set responsible');
      update.responsibleId = responsibleId;
    }

    if (contributorsIds) {
      if (!isPermitted({
        user,
        action: 'responses.manageContributors',
        data: { response },
      })
      ) throw new Error('User is not permitted to set contributors');
      update.contributorsIds = contributorsIds;
    }

    if (followersIds) {
      if (!isPermitted({
        user,
        action: 'responses.manageFollowers',
        data: { response },
      })
      ) throw new Error('User is not permitted to set followers');
      update.followersIds = followersIds;
    }

    const updatedResponse = await Responses.customUpdateOne(
      { _id },
      update,
      user.userId,
      organization._id,
    );

    // Send notifications to assignees
    if (accountableId) await Responses.customAssigneeNotification(response._id, [accountableId], 'accountable', organization);
    if (responsibleId) await Responses.customAssigneeNotification(response._id, [responsibleId], 'responsible', organization);
    if (contributorsIds) await Responses.customAssigneeNotification(response._id, contributorsIds, 'contributor', organization);
    if (followersIds) await Responses.customAssigneeNotification(response._id, followersIds, 'follower', organization);

    return updatedResponse;
  } catch (error: any) {
    throw new Error(error);
  }
};

export default updateResponse;
