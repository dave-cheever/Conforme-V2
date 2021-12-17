import { v4 as uuidv4 } from "uuid";

import { Comments, Responses } from "app-models";
import { genMetatags, isPermitted, mentionParser } from "app-utils";
import { EmailService } from "app-services";

const createComment = async (_, { commentInput }, { authorize, organization }) => {
    try {
      const user = await authorize();

      const response = await Responses.customFindById(commentInput.responseId);
  
      if (!isPermitted({ user, action: "comments.add", data: { response } })) {
        throw new Error("User is not permitted");
      }      
  
      const newComment = {
        _id: uuidv4(),
        ...commentInput,
        authorId: user._id,
        metatags: genMetatags("added", user._id),
      };
  
      await Comments.create(newComment);

      //handle mentioning on chat
      const mentionedUserIds = mentionParser(newComment.text);

      if(mentionedUserIds?.length > 0){
        EmailService.sendMentionedEmail({userIds: mentionedUserIds,organization, message: newComment.text });
      }
  
      return newComment;
    } catch (err: any) {
      throw new Error(err);
    }
  };
  
  export default createComment;