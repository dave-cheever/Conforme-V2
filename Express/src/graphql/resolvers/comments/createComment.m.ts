import { v4 as uuidv4 } from "uuid";

import { Comments } from "app-models";
import { genMetatags, isPermitted } from "app-utils";


const createComment = async (_, { commentInput }, { authorize }) => {
    try {
      const user = await authorize();
  
      if (!isPermitted({ user, action: "comments.add" })) {
        throw new Error("User is not permitted");
      }      
  
      const newComment = {
        _id: uuidv4(),
        ...commentInput,
        metatags: genMetatags("added", user._id),
      };
  
      await Comments.create(newComment)
  
      return newComment;
    } catch (err: any) {
      throw new Error(err);
    }
  };
  
  export default createComment;