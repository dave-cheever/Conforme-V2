import { QuestionCategories } from "app-models";
import { isPermitted } from "app-utils";

const updateQuestionCategory = async (_, { questionCategoryInput }, { authorize, organization }) => {
  try {
    const user = await authorize();

    if (
      !isPermitted({ user, action: "questionCategories.edit", data: questionCategoryInput })
    ) {
      throw new Error("User is not permitted");
    }

    const questionCategory = await QuestionCategories.customFindById(questionCategoryInput._id, organization._id);
    if (!questionCategory) {
      throw new Error("Question Category doesn't exist");
    }

    const updatedQuestionCategory = await QuestionCategories.customUpdateOne({ _id: questionCategory._id }, questionCategoryInput, user._id, organization._id);
    return updatedQuestionCategory;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default updateQuestionCategory;