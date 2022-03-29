import { Comments } from 'app-models';
import { isPermitted } from 'app-utils';

const deleteComment = async (_, { _id }, { authorize, organization }) => {
  try {
    const user = await authorize();
    const comment = await Comments.customFindById(_id, organization._id);

    if (!comment) throw new Error("Comment doesn't exist");

    if (!isPermitted({ user, action: 'comments.delete', data: { comment } }))
      throw new Error('User is not permitted');

    const deletedResult = await Comments.customDelete(
      { _id },
      user._id,
      organization._id,
    );
    return deletedResult;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default deleteComment;
