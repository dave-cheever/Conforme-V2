import { Answers } from 'app-models';
import { isPermitted } from 'app-utils';

const updateAnswer = async (
  _,
  { answerInput },
  { authorize, organization },
) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: 'answers.edit', data: answerInput }))
      throw new Error('User is not permitted');

    const answer = await Answers.customFindById(
      answerInput._id,
      organization._id,
    );
    if (!answer) throw new Error("Answer doesn't exist");

    const updatedAnswer = await Answers.customUpdateOne(
      { _id: answer._id },
      answerInput,
      user._id,
      organization._id,
    );
    return updatedAnswer;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default updateAnswer;
