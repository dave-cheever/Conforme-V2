import { IResponse } from "app-interfaces";
import { Responses } from "app-models";
import { genMetatags, isPermitted } from "app-utils";

const removeParticipant = async (_, { responseParticipantRemove }, { authorize, organization }) => {
  try {
    const user = await authorize();
    const { _id, participantId, permission } = responseParticipantRemove;
    const response = await Responses.customFindById(_id, organization._id);

    if (!participantId) {
      throw new Error("Invalid input");
    }

    if (!response) {
      throw new Error("Response doesn't exist");
    }

    const update: Partial<IResponse> = {};
    switch (permission) {
      case "accountable":
        if (!isPermitted({ user, action: "responses.manageAccountable", data: { response } })) {
          throw new Error("User is not permitted to remove accountable");
        }

        if (response.accountableId === participantId) {
          update.accountableId = "";
        }
        break;
      case "responsible":
        if (!isPermitted({ user, action: "responses.manageResponsible", data: { response } })) {
          throw new Error("User is not permitted to remove responsible");
        }

        if (response.responsibleId === participantId) {
          update.responsibleId = "";
        }
        break;
      case "contributor":
        if (!isPermitted({ user, action: "responses.manageContributor", data: { response } })) {
          throw new Error("User is not permitted to remove contributor");
        }

        update.contributorsIds = response.contributorsIds?.filter(_id => _id !== participantId);
        break;
      case "follower":
        if (!isPermitted({ user, action: "responses.manageFollower", data: { response } }) &&
          !isPermitted({ user, action: "responses.manageMultipleFollowers", data: { response } })) {
          throw new Error("User is not permitted to unfollow");
        }

        update.followersIds = response.followersIds?.filter(_id => _id !== participantId);
        break;
      default:
        break;
    }

    const updatedResponse = await Responses.customUpdateOne({ _id }, update, user._id, organization._id);
    return !!updatedResponse;
  } catch (error: any) {
    throw new Error(error);
  }
}

export default removeParticipant;
