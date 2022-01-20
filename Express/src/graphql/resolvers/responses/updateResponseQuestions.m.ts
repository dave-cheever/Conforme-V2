import { Responses } from "app-models";
import { genMetatags, isPermitted } from "app-utils";
import organization from "../organizations/organization.q";

const updateResponseQuestions = async (_, { updateResponseQuestionsModify }, { authorize, organization }) => {
  try {
    const user = await authorize();

    const { _id, answers } = updateResponseQuestionsModify;

    const responseDocument = await Responses.findOne({ _id , organizationId: organization._id});
    if (!responseDocument) {
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

    await Responses.customUpdateOne({ _id }, { questions }, user._id, organization._id);
    return true;
  } catch (error: any) {
    throw new Error(error);
  }
}

export default updateResponseQuestions;
