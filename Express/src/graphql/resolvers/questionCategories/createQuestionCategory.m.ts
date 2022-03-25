import { QuestionCategories } from "app-models";
import { isPermitted } from "app-utils";

const createQuestionCategory = async (_, { questionCategory }, { authorize, organization }) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: "questionCategories.add" })) {
      throw new Error("User is not permitted");
    }

    const createdQuestionCategory = await QuestionCategories.customCreate(questionCategory, user._id, organization._id);
    return createdQuestionCategory;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default createQuestionCategory;