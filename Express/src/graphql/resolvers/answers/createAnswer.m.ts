import { Answers } from 'app-models';
import { isPermitted } from 'app-utils';

const createAnswer = async (_, { answer }, { authorize, organization }) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: 'answers.add' }))
      throw new Error('User is not permitted');

    const createdAnswer = await Answers.customCreate(
      answer,
      user._id,
      organization._id,
    );

    return createdAnswer;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default createAnswer;
