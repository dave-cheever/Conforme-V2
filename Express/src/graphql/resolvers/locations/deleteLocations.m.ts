import { Locations } from 'app-models';
import { isPermitted } from 'app-utils';

const deleteLocation = async (_, { _id }, { authorize, organization }) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: 'locations.delete', data: { _id } }))
      throw new Error('User is not permitted');

    const location = await Locations.customFindById(_id);
    if (!location) throw new Error("Location doesn't exist");

    const deletedResult = await Locations.customDelete(
      { _id },
      user._id,
      organization._id,
    );
    return deletedResult;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default deleteLocation;
