import { Questions } from 'app-models';
import { isPermitted } from 'app-utils';

const updateQuestion = async (
  _,
  { questionInput },
  { authorize, organization },
) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: 'questions.edit', data: questionInput }))
      throw new Error('User is not permitted');

    const question = await Questions.customFindById(
      questionInput._id,
      organization._id,
    );
    if (!question)
      throw new Error("Question doesn't exist");

    const updatedQuestion = await Questions.customUpdateOne(
      { _id: question._id },
      questionInput,
      user._id,
      organization._id,
    );
    return updatedQuestion;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default updateQuestion;
