import { Locations } from 'app-models';
import { isPermitted } from 'app-utils';

const updateLocation = async (
  _,
  { locationModifyInput },
  { authorize, organization },
) => {
  try {
    const user = await authorize();
    const { _id } = locationModifyInput;

    if (
      !isPermitted({
        user,
        action: 'locations.edit',
        data: locationModifyInput,
      })
    )
      throw new Error('User is not permitted');

    const location = await Locations.customFindById(_id);
    if (!location) throw new Error("Location doesn't exist");

    const updatedLocation = await Locations.customUpdateOne(
      { _id: location._id },
      locationModifyInput,
      user._id,
      organization._id,
    );
    return updatedLocation;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default updateLocation;
