import { Answers } from 'app-models';
import { checkAnswerPermission } from 'app-utils';

const deleteAnswer = async (_, { _id }, { authorize, organization }) => {
  try {
    const user = await authorize();

    const answer = await Answers.customFindById(_id, organization._id);
    if (!answer) throw new Error("Answer doesn't exist");

    const isPermitted = checkAnswerPermission({
      user,
      answer,
      organization,
      permissionAction: 'delete',
    });
    if (!isPermitted) throw new Error('User is not permitted to delete this answer.');

    const deletedResult = await Answers.customDelete({ _id }, user._id, organization._id);

    return deletedResult;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default deleteAnswer;
