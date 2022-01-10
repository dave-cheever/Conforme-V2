import { genMetatags, isPermitted } from "app-utils";
import { Locations } from "app-models";

const deleteLocation= async (_, { _id }, { authorize }) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: "locations.delete", data: { _id } })) {
      throw new Error("User is not permitted");
    }

    const location = await Locations.customFindById(_id);
    if (!location) {
      throw new Error("Location doesn't exist");
    }

    const deletedLocation = {
      ...location,
      metatags: {
        ...location?.metatags,
        ...genMetatags("removed", user._id),
      },
    };
    await Locations.updateOne({ _id: location._id }, deletedLocation);

    return true;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default deleteLocation;
