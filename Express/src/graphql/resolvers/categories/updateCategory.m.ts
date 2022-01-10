import { v4 as uuidv4 } from "uuid";

import { Categories } from "app-models";
import { genMetatags, isPermitted } from "app-utils";

const updateCategory = async (_, { categoryInput }, { authorize, organization }) => {
  try {
    const user = await authorize();

    if (
      !isPermitted({ user, action: "categories.edit", data: categoryInput })
    ) {
      throw new Error("User is not permitted");
    }

    const category = await Categories.customFindById(categoryInput._id, organization._id);
    if (!category) {
      throw new Error("Category doesn't exist");
    }

    const updatedCategory = await Categories.customUpdateOne({ _id: category._id }, { name: categoryInput.name }, user._id, organization._id);
    return updatedCategory;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default updateCategory;
