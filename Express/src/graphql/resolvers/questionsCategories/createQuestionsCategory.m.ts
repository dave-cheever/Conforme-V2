import { QuestionsCategories } from "app-models";
import { isPermitted } from "app-utils";

const createQuestionsCategory = async (_, { questionsCategory }, { authorize, organization }) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: "questionsCategories.add" })) {
      throw new Error("User is not permitted");
    }

    const createdQuestionsCategory = await QuestionsCategories.customCreate(questionsCategory, user._id, organization._id);
    return createdQuestionsCategory;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default createQuestionsCategory;