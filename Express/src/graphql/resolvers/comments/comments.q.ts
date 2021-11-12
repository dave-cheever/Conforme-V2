import { Comments } from "app-models";

const comments = async (_, __, ___) => {
  try {
    const comments = await Comments.get();

    return comments;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default comments;
