import { FunctionalAreas } from "app-models";
import { genMetatags, isPermitted } from "app-utils";

const updateFunctionalArea = async (
  _,
  { functionalAreaInput },
  { authorize }
) => {
  try {
    const user = await authorize();

    if (
      !isPermitted({
        user,
        action: "funcAreas.edit",
        data: functionalAreaInput,
      })
    ) {
      throw new Error("User is not permitted");
    }

    const functionalArea = await FunctionalAreas.getById(functionalAreaInput._id);
    if (!functionalArea) {
      throw new Error("Functional area doesn't exist");
    }

    const updatedFunctionalArea = {
      ...functionalArea,
      name: functionalAreaInput.name,
      metatags: {
        ...functionalArea?.metatags,
        ...genMetatags("updated", user._id),
      },
    };
    await FunctionalAreas.updateOne(
      { _id: functionalArea._id },
      updatedFunctionalArea
    );

    return updatedFunctionalArea;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default updateFunctionalArea;
