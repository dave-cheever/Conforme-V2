import { Responses } from "app-models";
import { genMetatags } from "app-utils";

const removeDelegate = async (_, { responseDelegateModifyInput }, { authorize }) => {  
  try {
    const user = await authorize();
    const {_id, delegateId} = responseDelegateModifyInput;
    const response = await Responses.getById(_id);

    if (!response) {
      throw new Error("Response doesn't exist");
    }
    let updatedResponse = {};
    
    let delegateIds = response.delegateIds;
    delegateIds = delegateIds.filter(_id => _id !== delegateId);
    
    updatedResponse = {
      ...response,
      delegateIds,
      metatags: {
        ...response?.metatags,
        ...genMetatags("updated", user._id),
      },
    };
    
    await Responses.updateOne({_id}, updatedResponse);
    
    return true;
  } catch (error: any) {
    throw new Error(error);
  }
}

export default removeDelegate;
