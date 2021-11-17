import { Responses } from "app-models";

const updateResponse = async (_, { responseModifyInput }, { authorize }) => {  
  try {
    const user = await authorize();

    const {_id,} = responseModifyInput
    const response = await Responses.getById(_id);

    if (!response) {
      throw new Error("Response doesn't exist");
    }
    let updatedResponse = {};
    
    await Responses.updateOne({_id}, updatedResponse);
    
    return updatedResponse;
  } catch (error: any) {
    throw new Error(error);
  }
}

export default updateResponse;
