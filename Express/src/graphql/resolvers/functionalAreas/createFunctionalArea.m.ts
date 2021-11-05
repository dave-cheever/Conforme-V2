import { v4 as uuidv4 } from "uuid";

import { IBaseWithName } from "app-interfaces";
import { FunctionalAreas } from "app-models";
import { genMetatags, isPermitted } from "app-utils";

const createFunctionalArea = async (_, { name }, { authorize }) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: "funcAreas.add" })) {
      throw new Error("User is not permitted");
    }

    const newFunctionalArea = {
      _id: uuidv4(),
      name,
      metatags: genMetatags("added", user._id),
    };

    await FunctionalAreas.create(newFunctionalArea);

    return newFunctionalArea;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default createFunctionalArea;
