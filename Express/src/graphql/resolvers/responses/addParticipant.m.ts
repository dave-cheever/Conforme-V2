import { IResponse } from 'app-interfaces';
import { Responses } from 'app-models';
import { isPermitted } from 'app-utils';

const addParticipant = async (
  _,
  { responseParticipantModify },
  { authorize, organization },
) => {
  try {
    const user = await authorize();

    const { _id, participantIds, permission } = responseParticipantModify;
    const response = await Responses.customFindById(_id, organization._id);

    if (!participantIds) throw new Error('Invalid input');

    if (!response) throw new Error("Response doesn't exist");

    const update: Partial<IResponse> = {};
    switch (permission) {
      case 'accountable':
        if (
          !isPermitted({
            user,
            action: 'responses.manageAccountable',
            data: { response },
          })
        )
          throw new Error('User is not permitted to add accountable');

        update.accountableId = participantIds[0];

        break;
      case 'responsible':
        if (
          !isPermitted({
            user,
            action: 'responses.manageResponsible',
            data: { response },
          })
        )
          throw new Error('User is not permitted to add responsible');

        update.responsibleId = participantIds[0];
        break;

      case 'contributor':
        if (
          !isPermitted({
            user,
            action: 'responses.manageContributor',
            data: { response },
          })
        )
          throw new Error('User is not permitted to add contributor');

        update.contributorsIds =
          response.contributorsIds?.concat(participantIds);

        break;
      case 'follower':
        if (
          !isPermitted({
            user,
            action: 'responses.manageFollower',
            data: { response },
          }) &&
          !isPermitted({
            user,
            action: 'responses.manageMultipleFollowers',
            data: { response },
          })
        )
          throw new Error('User is not permitted to follow');

        update.followersIds = response.followersIds?.concat(participantIds);
        break;

      default:
        break;
    }

    if (Object.keys(update).length > 0) {
      await Responses.customAssigneeNotification(_id, participantIds, permission, organization);
      const updatedResponse = await Responses.customUpdateOne(
        { _id },
        update,
        user._id,
        organization._id,
      );
      return updatedResponse;
    }

    return response;
  } catch (error: any) {
    throw new Error(error);
  }
};

export default addParticipant;
