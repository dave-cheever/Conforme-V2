import { QuestionCategories } from "app-models";
import { isPermitted } from "app-utils";

const deleteQuestionCategory = async (_, { _id }, { authorize, organization }) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: "questionCategories.delete", data: { _id } })) {
      throw new Error("User is not permitted");
    }

    const deletedResult = await QuestionCategories.customDelete({ _id }, user._id, organization._id);
    return deletedResult;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default deleteQuestionCategory;