import mongoose from 'mongoose';

import { BusinessUnits } from 'app-models';
import { isPermitted } from 'app-utils';

const createBusinessUnit = async (
  _,
  { businessUnitInput },
  { authorize, organization },
) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: 'businessUnits.add' }))
      throw new Error('User is not permitted');

    const newBusinessUnit = {
      ...businessUnitInput,
      name: businessUnitInput.name.trim(),
      scope: {
        moduleId:businessUnitInput?.moduleId,
      },
    };
    const createdBusinessUnit = await BusinessUnits.customCreate(
      newBusinessUnit,
      user.userId,
      organization._id,
    );
    return createdBusinessUnit;
  } catch (err: any) {
    if (err instanceof mongoose.Error.ValidationError)
      throw new Error(err.errors.name.message);

    throw new Error(err);
  }
};

export default createBusinessUnit;
