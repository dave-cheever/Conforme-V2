import { Categories } from "app-models";
import { genMetatags, isPermitted } from "app-utils";

const deleteCategory = async (_, { _id }, { authorize }) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: "categories.delete", data: { _id } })) {
      throw new Error("User is not permitted");
    }

    const category = await Categories.customFindById(_id);
    if (!category) {
      throw new Error("Category doesn't exist");
    }

    const deletedCategory = {
      ...category,
      metatags: {
        ...category?.metatags,
        ...genMetatags("removed", user._id),
      },
    };
    await Categories.updateOne({ _id: category._id }, deletedCategory);

    return true;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default deleteCategory;
