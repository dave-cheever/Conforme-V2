import { BusinessUnits } from "app-models";
import { genMetatags, isPermitted } from "app-utils";

const deleteBusinessUnit = async (_, { _id }, { authorize }) => {
    try {
      const user = await authorize();
  
      if (!isPermitted({ user, action: "businessUnits.delete", data: { _id } })) {
        throw new Error("User is not permitted");
      }
  
      const businessUnit = await BusinessUnits.getById(_id);
      if (!businessUnit) {
        throw new Error("Business Unit doesn't exist");
      }
  
      const deletedBusinessUnit = {
        ...businessUnit._doc,
        metatags: {
          ...businessUnit?.metatags,
          ...genMetatags("removed", user._id),
        },
      };
      await BusinessUnits.updateOne({ _id: businessUnit._id }, deletedBusinessUnit);
  
      return true;
    } catch (err: any) {
      throw new Error(err);
    }
  };
  
  export default deleteBusinessUnit;
  