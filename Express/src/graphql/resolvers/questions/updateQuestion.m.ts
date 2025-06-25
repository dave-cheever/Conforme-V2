import { Questions } from 'app-models';
import { checkQuestionPermission } from 'app-utils';

const updateQuestion = async (_, { questionInput }, { authorize, organization }) => {
  try {
    const user = await authorize();

    const question = await Questions.customFindById(questionInput._id, organization._id);
    if (!question) throw new Error("Question doesn't exist");

    const isPermitted = checkQuestionPermission({
      user,
      question,
      organization,
      permissionAction: 'edit',
    });
    if (!isPermitted) throw new Error('User is not permitted to update this question.');

    const updatedQuestion = await Questions.customUpdateOne({ _id: question._id }, questionInput, user.userId, organization._id);
    return updatedQuestion;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default updateQuestion;
