import { Comments } from "app-models";
import { genMetatags, isPermitted } from "app-utils";

const deleteComment = async (_, { _id }, { authorize }) => {
    try {
      const user = await authorize();
  
      if (!isPermitted({ user, action: "comments.delete", data: { _id } })) {
        throw new Error("User is not permitted");
      }
  
      const comment = await Comments.getById(_id);
      if (!comment) {
        throw new Error("Business Unit doesn't exist");
      }
  
      const deletedComment = {
        ...comment,
        metatags: {
          ...comment?.metatags,
          ...genMetatags("removed", user._id),
        },
      };

      console.log("deletedComment", deletedComment);
      
      await Comments.updateOne({ _id: comment._id }, deletedComment);
  
      return true;
    } catch (err: any) {
      throw new Error(err);
    }
  };
  
  export default deleteComment;