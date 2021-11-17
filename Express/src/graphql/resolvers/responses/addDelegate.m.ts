import { Responses } from "app-models";
import { genMetatags } from "app-utils";

const addDelegate = async (_, { responseDelegateModifyInput }, { authorize }) => {  
  try {
    const user = await authorize();

    const {_id, delegateId} = responseDelegateModifyInput;
    const response = await Responses.getById(_id);

    if (!response) {
      throw new Error("Response doesn't exist");
    }

    let delegateIds = response.delegateIds;
    delegateIds.push(delegateId);
    
    const updatedResponse = {
      ...response,
      delegateIds,
      metatags: {
        ...response?.metatags,
        ...genMetatags("updated", user._id),
      },
    };
    
    await Responses.updateOne({_id}, updatedResponse);
    
    return updatedResponse;
  } catch (error: any) {
    throw new Error(error);
  }
}

export default addDelegate;
