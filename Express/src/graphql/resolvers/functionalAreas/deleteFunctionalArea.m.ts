import { v4 as uuidv4 } from "uuid";

import { IBaseWithName } from "app-interfaces";
import { FunctionalAreas } from "app-models";
import { genMetatags, isPermitted } from "app-utils";

const deleteFunctionalArea = async (_, { _id }, { authorize }) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: "funcAreas.delete", data: { _id } })) {
      throw new Error("User is not permitted");
    }

    const functionalArea = await FunctionalAreas.getById(_id);
    if (!functionalArea) {
      throw new Error("Functinal Area doesn't exist");
    }

    const deletedFunctionalArea = {
      ...functionalArea,
      metatags: {
        ...functionalArea?.metatags,
        ...genMetatags("removed", user._id),
      },
    };
    await FunctionalAreas.updateOne(
      { _id: functionalArea._id },
      deletedFunctionalArea
    );

    return true;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default deleteFunctionalArea;
