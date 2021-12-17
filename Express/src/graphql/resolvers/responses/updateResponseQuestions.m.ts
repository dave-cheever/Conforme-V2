import { Responses } from "app-models";
import { genMetatags, isPermitted } from "app-utils";

const updateResponseQuestions = async (_, { updateResponseQuestionsModify }, { authorize }) => {
  try {
    const user = await authorize();

    const { _id, answers } = updateResponseQuestionsModify;

    const responseDocument = await Responses.findById(_id);
    if (!responseDocument?._doc) {
      throw new Error("Response doesn't exist");
    }
    const response = responseDocument._doc;

    if (!isPermitted({ user, action: 'responses.edit', data: { response } })) {
      throw new Error('User is not permitted');
    }

    const questions = [...response.questions];
    for (const question of questions) {
      if (!question.outdated && answers.hasOwnProperty(question.name)) {
        question.value = answers[question.name];
      }
    }

    responseDocument.questions = questions;
    responseDocument.metatags = {
      ...response?.metatags,
      ...genMetatags("updated", user._id),
    };
    await responseDocument.save();
    // @ts-ignore
    await responseDocument.customRecalculateResponse();
    return true;
  } catch (error: any) {
    throw new Error(error);
  }
}

export default updateResponseQuestions;
