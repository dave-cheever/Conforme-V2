import { emailPreview } from "app-utils";

const generateThumbnail = async (_, { thumbnailCreate }, { authorize, organization }) => {
    try {
      const user = await authorize();
  
      if (!user) {
        throw new Error("User is not permitted");
      }

      const { _id, html } = thumbnailCreate;
      
      if (html) {
        await emailPreview({templateId:_id, html, organization});
      }
      return true;

    } catch (err: any) {
      throw new Error(err);
    }
  };
  
  export default generateThumbnail;
  