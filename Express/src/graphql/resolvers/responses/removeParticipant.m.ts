import { Responses } from "app-models";
import { genMetatags, isPermitted } from "app-utils";

const removeParticipant = async (_, { responseParticipantRemove }, { authorize }) => {  
  try {
    const user = await authorize();
    const {_id, participantId, permission} = responseParticipantRemove;
    const response = await Responses.getById(_id);

    if(!participantId) {
      throw new Error("Invalid input");
    }

    if (!response) {
      throw new Error("Response doesn't exist");
    }

    const updatedResponse = {
      ...response,
      metatags: {
        ...response?.metatags,
        ...genMetatags("updated", user._id),
      },
    };

    switch (permission) {
      case "accountable":
        if (!isPermitted({ user, action: "responses.manageAccountable", data: { response } })) {
          throw new Error("User is not permitted to remove accountable");
        }

        if (response.accountableId === participantId) {
          updatedResponse.accountableId = "";
        }
        
        break;
      case "responsible":
        if (!isPermitted({ user, action: "responses.manageResponsible", data: { response } })) {
          throw new Error("User is not permitted to remove responsible");
        }

        if (response.responsibleId === participantId) {
          updatedResponse.responsibleId = "";
        }

        break;
      case "contributor":
        if (!isPermitted({ user, action: "responses.manageContributor", data: { response } })) {
          throw new Error("User is not permitted to remove contributor");
        }

        updatedResponse.contributorsIds = response.contributorsIds?.filter(_id => _id !== participantId);

        break;
      case "follower":
        if (!isPermitted({ user, action: "responses.manageFollower", data: { response } }) && 
        !isPermitted({ user, action: "responses.manageMultipleFollowers", data: { response }})) {
          throw new Error("User is not permitted to unfollow");
        }

        updatedResponse.followersIds = response.followersIds?.filter(_id => _id !== participantId);

        break;
      default:
        break;
    }
    
    await Responses.updateOne({_id}, updatedResponse);
    
    return true;
  } catch (error: any) {
    throw new Error(error);
  }
}

export default removeParticipant;
