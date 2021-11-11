import { v4 as uuidv4 } from "uuid";

import { IBaseWithName } from "app-interfaces";
import { Categories } from "app-models";
import { genMetatags, isPermitted } from "app-utils";

const createCategory = async (_, { name }, { authorize }) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: "categories.add" })) {
      throw new Error("User is not permitted");
    }

    const newCategory = {
      _id: uuidv4(),
      name,
      metatags: genMetatags("added", user._id),
    };

    await Categories.create(newCategory);

    return newCategory;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default createCategory;
