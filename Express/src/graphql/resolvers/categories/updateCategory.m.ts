import { v4 as uuidv4 } from "uuid";

import { IBaseWithName } from "app-interfaces";
import { Categories } from "app-models";
import { genMetatags, isPermitted } from "app-utils";

const updateCategory = async (_, { categoryInput }, { authorize }) => {
  try {
    const user = await authorize();

    if (
      !isPermitted({ user, action: "categories.edit", data: categoryInput })
    ) {
      throw new Error("User is not permitted");
    }

    const category = await Categories.getById(categoryInput._id);
    if (!category) {
      throw new Error("Category doesn't exist");
    }

    const updatedCategory = {
      ...category,
      name: categoryInput.name,
      metatags: {
        ...category?.metatags,
        ...genMetatags("updated", user._id),
      },
    };
    await Categories.updateOne({ _id: category._id }, updatedCategory);

    return updatedCategory;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default updateCategory;
