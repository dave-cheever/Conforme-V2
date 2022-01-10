import { BusinessUnits, Users } from "app-models";
import { genMetatags, isPermitted } from "app-utils";

const updateUser = async (_, { updateUserModifyInput }, { authorize, organization }) => {
    try {
      const user = await authorize();
      if (
        !isPermitted({ user, action: "users.edit", data: updateUserModifyInput })
      ) {
        throw new Error("User is not permitted");
      }
      const updateUser = await Users.customFindById(updateUserModifyInput._id, organization._id);
      if (!updateUser) {
        throw new Error("User doesn't exist");
      }
      const updatedUser = {
        ...updateUser._doc,
        ...updateUserModifyInput,
        metatags: {
          ...updateUser?.metatags,
          ...genMetatags("updated", user._id),
        },
      };
      await Users.updateOne({ _id: updateUser._id }, updatedUser);

      return updatedUser;
    } catch (err: any) {
      throw new Error(err);
    }
  };
  
  export default updateUser;
  