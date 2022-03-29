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

    const createdBusinessUnit = await BusinessUnits.customCreate(
      businessUnitInput,
      user._id,
      organization._id,
    );
    return createdBusinessUnit;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default createBusinessUnit;
