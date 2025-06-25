import { Answers } from 'app-models';
import { checkAnswerPermission } from 'app-utils';

const updateAnswer = async (_, { answerInput }, { authorize, organization }) => {
  try {
    const user = await authorize();

    const answer = await Answers.customFindById(answerInput._id, organization._id);
    if (!answer) throw new Error("Answer doesn't exist");

    const isPermitted = checkAnswerPermission({
      user,
      answer,
      organization,
      permissionAction: 'edit',
    });
    if (!isPermitted) throw new Error('User is not permitted to update this answer.');

    const updatedAnswer = await Answers.customUpdateOne({ _id: answer._id }, answerInput, user.userId, organization._id);
    return updatedAnswer;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default updateAnswer;
