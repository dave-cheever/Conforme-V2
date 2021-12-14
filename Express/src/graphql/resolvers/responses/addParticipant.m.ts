import { Responses } from "app-models";
import { genMetatags, isPermitted } from "app-utils";

const addParticipant = async (_, { responseParticipantModify }, { authorize }) => {  
  try {
    const user = await authorize();

    const {_id, participantIds, permission} = responseParticipantModify;
    const response = await Responses.customFindById(_id);

    if(!participantIds) {
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
          throw new Error("User is not permitted to add accountable");
        }
        updatedResponse.accountableId = participantIds[0];
        
        break;
      case "responsible":
        if (!isPermitted({ user, action: "responses.manageResponsible", data: { response } })) {
          throw new Error("User is not permitted to add responsible");
        }
        updatedResponse.responsibleId = participantIds[0];
        break;

      case "contributor":
        if (!isPermitted({ user, action: "responses.manageContributor", data: { response } })) {
          throw new Error("User is not permitted to add contributor");
        }
        updatedResponse.contributorsIds = response.contributorsIds?.concat(participantIds);
        
        break;
      case "follower":
        if (!isPermitted({ user, action: "responses.manageFollower", data: { response } }) && 
          !isPermitted({ user, action: "responses.manageMultipleFollowers", data: { response } })) {
          throw new Error("User is not permitted to follow");
        }
        
        updatedResponse.followersIds = response.followersIds?.concat(participantIds);
        break;
    
      default:
        break;
    }
    
    
    await Responses.updateOne({_id}, updatedResponse);
    
    return updatedResponse;
  } catch (error: any) {
    throw new Error(error);
  }
}

export default addParticipant;
