import { Answers } from 'app-models';
import { checkAnswerPermission } from 'app-utils';

const createAnswer = async (_, { answer }, { authorize, organization }) => {
  try {
    const user = await authorize();

    const isPermitted = checkAnswerPermission({
      user,
      answer,
      organization,
      permissionAction: 'add',
    });
    if (!isPermitted) throw new Error('User is not permitted to create an answer.');

    const createdAnswer = await Answers.customCreate(answer, user._id, organization._id);

    return createdAnswer;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default createAnswer;
