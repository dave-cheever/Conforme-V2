import { Questions } from 'app-models';
import { checkQuestionPermission } from 'app-utils';

const createQuestion = async (_, { question }, { authorize, organization }) => {
  try {
    const user = await authorize();

    const isPermitted = checkQuestionPermission({
      user,
      question,
      organization,
      permissionAction: 'add',
    });
    if (!isPermitted) throw new Error('User is not permitted to create a question.');

    const createdQuestion = await Questions.customCreate(question, user._id, organization._id);
    return createdQuestion;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default createQuestion;
