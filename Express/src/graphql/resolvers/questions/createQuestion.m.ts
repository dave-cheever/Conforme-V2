import { Questions } from "app-models";
import { isPermitted } from "app-utils";

const createQuestion = async (_, { question }, { authorize, organization }) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: "questions.add" })) {
      throw new Error("User is not permitted");
    }

    const createdQuestion = await Questions.customCreate(question, user._id, organization._id);
    return createdQuestion;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default createQuestion;
