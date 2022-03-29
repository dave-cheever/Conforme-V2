import { BusinessUnits } from 'app-models';
import { isPermitted } from 'app-utils';

const updateBusinessUnit = async (
  _,
  { businessUnitModifyInput },
  { authorize, organization },
) => {
  try {
    const user = await authorize();

    if (
      !isPermitted({
        user,
        action: 'businessUnits.edit',
        data: businessUnitModifyInput,
      })
    )
      throw new Error('User is not permitted');

    const businessUnit = await BusinessUnits.customFindById(
      businessUnitModifyInput._id,
      organization._id,
    );
    if (!businessUnit) throw new Error("Business Unit doesn't exist");

    const updatedBusinessUnit = await BusinessUnits.customUpdateOne(
      { _id: businessUnit._id },
      businessUnitModifyInput,
      user._id,
      organization._id,
    );
    return updatedBusinessUnit;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default updateBusinessUnit;
