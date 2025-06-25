import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { Locations } from 'app-models';
import { genMetatags, isPermitted } from 'app-utils';

const createLocation = async (
  _,
  { locationInput },
  { authorize, organization },
) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: 'locations.add' }))
      throw new Error('User is not permitted');

    const newLocation = {
      _id: uuidv4(),
      ...locationInput,
      name: locationInput.name.trim(),
      organizationId: organization._id,
      metatags: genMetatags('added', user.userId),
      scope: {
        moduleId:locationInput?.moduleId,
      },
    };

    const location = await Locations.customCreate(
      newLocation,
      user.userId,
      organization._id,
    );

    return location;
  } catch (err: any) {
    if (err instanceof mongoose.Error.ValidationError)
      throw new Error(err.errors.name.message);

    throw new Error(err);
  }
};

export default createLocation;
