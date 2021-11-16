import { Responses } from "app-models";

const updateResponse = async (_, { responseModifyInput }, { authorize }) => {  
  try {
    const response = await Responses.get({_id: "90292d33-383f-4639-8b00-b601d85596ab"});
    
    return response[0];
  } catch (error: any) {
    throw new Error(error);
  }
}

export default updateResponse;
