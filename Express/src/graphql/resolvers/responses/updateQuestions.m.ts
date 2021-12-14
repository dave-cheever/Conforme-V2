import { Responses } from "app-models";
import { genMetatags } from "app-utils";

const updateQuestions = async (_, { updateResponseQuestionsModify }, { authorize }) => {
  try {
    const user = await authorize();

    const { _id, answers } = updateResponseQuestionsModify;
    
    const response = await Responses.customFindById(_id);
    if (!response) {
      throw new Error("Response doesn't exist");
    }

    const questions = [...response.questions];
    for (const question of questions) {
      if (!question.outdated && answers.hasOwnProperty(question.name)) {
        question.value = answers[question.name];
      }
    }

    const updatedResponse = {
      ...response,
      questions,
      metatags: {
        ...response?.metatags,
        ...genMetatags("updated", user._id),
      },
    };

    await Responses.updateOne({ _id }, updatedResponse);
    return true;
  } catch (error: any) {
    throw new Error(error);
  }
}

export default updateQuestions;
