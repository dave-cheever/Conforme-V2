import { BusinessUnits } from "app-models";
import { genMetatags, isPermitted } from "app-utils";

const updateBusinessUnit = async (_, { businessUnitInput }, { authorize }) => {
    try {
      const user = await authorize();
  
      if (
        !isPermitted({ user, action: "businessUnit.edit", data: businessUnitInput })
      ) {
        throw new Error("User is not permitted");
      }
  
      const businessUnit = await BusinessUnits.getById(businessUnitInput._id);
      if (!businessUnit) {
        throw new Error("Business Unit doesn't exist");
      }
  
      const updatedBusinessUnit = {
        ...businessUnitInput,
        metatags: {
          ...businessUnit?.metatags,
          ...genMetatags("updated", user._id),
        },
      };
      await BusinessUnits.updateOne({ _id: businessUnit._id }, updatedBusinessUnit);
  
      return updatedBusinessUnit;
    } catch (err: any) {
      throw new Error(err);
    }
  };
  
  export default updateBusinessUnit;
  