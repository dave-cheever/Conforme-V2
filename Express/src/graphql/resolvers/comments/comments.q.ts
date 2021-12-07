import { Comments } from "app-models";

const comments = async (_, {_id}, ___) => {
  try {
    const comments = await Comments.get(_id);
    return comments;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default comments;
