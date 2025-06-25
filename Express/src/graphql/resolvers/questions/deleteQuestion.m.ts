import { Questions } from 'app-models';
import { checkQuestionPermission } from 'app-utils';

const deleteQuestion = async (_, { _id }, { authorize, organization }) => {
  try {
    const user = await authorize();

    const question = await Questions.customFindById(_id, organization._id);
    if (!question) throw new Error("Question doesn't exist");

    const isPermitted = checkQuestionPermission({
      user,
      question,
      organization,
      permissionAction: 'delete',
    });
    if (!isPermitted) throw new Error('User is not permitted to delete this question.');

    const deletedResult = await Questions.customDelete({ _id }, user.userId, organization._id);
    return deletedResult;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default deleteQuestion;
