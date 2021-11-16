import { BusinessUnits } from "app-models";
import { genMetatags, isPermitted } from "app-utils";
import businessUnits from "./businessUnits.q";

const updateBusinessUnit = async (_, { businessUnitModifyInput }, { authorize }) => {
    try {
      const user = await authorize();
  
      if (
        !isPermitted({ user, action: "businessUnits.edit", data: businessUnitModifyInput })
      ) {
        throw new Error("User is not permitted");
      }
      const businessUnit = await BusinessUnits.getById(businessUnitModifyInput._id);
      if (!businessUnit) {
        throw new Error("Business Unit doesn't exist");
      }
      const updatedBusinessUnit = {
        ...businessUnit._doc,
        ...businessUnitModifyInput,
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
  