import { genMetatags, isPermitted } from "app-utils";
import { Locations, Users } from "app-models";

const updateLocation = async (_, { locationModifyInput }, { authorize, organization }) => {
  try {
    const user = await authorize();
    const { _id } = locationModifyInput;

    if (
      !isPermitted({ user, action: "locations.edit", data: locationModifyInput })
    ) {
      throw new Error("User is not permitted");
    }

    const location = await Locations.customFindById(_id);
    if (!location) {
      throw new Error("Location doesn't exist");
    }

    const updatedLocation = {
        ...location,
        ...locationModifyInput,
        metatags: {
          ...location?.metatags,
          ...genMetatags("updated", user._id),
        },
    };

    await Locations.updateOne({ _id: _id }, updatedLocation);

    return updatedLocation;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default updateLocation;
