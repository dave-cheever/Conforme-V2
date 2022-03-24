import { Questions } from "app-models";
import { isPermitted } from "app-utils";

const deleteQuestion = async (_, { _id }, { authorize, organization }) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: "questions.delete", data: { _id } })) {
      throw new Error("User is not permitted");
    }

    const deletedResult = await Questions.customDelete({ _id }, user._id, organization._id);
    return deletedResult;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default deleteQuestion;
