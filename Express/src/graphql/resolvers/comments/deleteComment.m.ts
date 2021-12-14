import { Comments } from "app-models";
import { genMetatags, isPermitted } from "app-utils";

const deleteComment = async (_, { _id }, { authorize }) => {
    try {
      const user = await authorize();
      const comment = await Comments.customFindById(_id);
  
      if (!isPermitted({ user, action: "comments.delete", data: { comment } })) {
        throw new Error("User is not permitted");
      }
  
      if (!comment) {
        throw new Error("Comment doesn't exist");
      }
  
      const deletedComment = {
        ...comment,
        metatags: {
          ...comment?.metatags,
          ...genMetatags("removed", user._id),
        },
      };
      
      await Comments.updateOne({ _id: comment._id }, deletedComment);
  
      return true;
    } catch (err: any) {
      throw new Error(err);
    }
  };
  
  export default deleteComment;