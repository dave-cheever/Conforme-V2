import { v4 as uuidv4 } from "uuid";

import { Categories } from "app-models";
import { genMetatags, isPermitted } from "app-utils";

const createCategory = async (_, { name }, { authorize, organization }) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: "categories.add" })) {
      throw new Error("User is not permitted");
    }

    const createdCategory = await Categories.customCreate({ name }, user._id, organization._id);
    return createdCategory;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default createCategory;
