import { Categories } from "app-models";
import { genMetatags, isPermitted } from "app-utils";

const deleteCategory = async (_, { _id }, { authorize, organization }) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: "categories.delete", data: { _id } })) {
      throw new Error("User is not permitted");
    }

    const deletedResult = await Categories.customDelete({ _id }, user._id, organization._id);
    return deletedResult;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default deleteCategory;
