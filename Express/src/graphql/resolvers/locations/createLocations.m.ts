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
      organizationId: organization._id,
      metatags: genMetatags('added', user._id),
    };

    const location = await Locations.customCreate(
      newLocation,
      user._id,
      organization._id,
    );

    return location;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default createLocation;
