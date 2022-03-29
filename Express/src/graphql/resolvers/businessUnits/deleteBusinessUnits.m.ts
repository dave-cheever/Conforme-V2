import { BusinessUnits } from 'app-models';
import { isPermitted } from 'app-utils';

const deleteBusinessUnit = async (_, { _id }, { authorize, organization }) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: 'businessUnits.delete', data: { _id } }))
      throw new Error('User is not permitted');

    const businessUnit = await BusinessUnits.customFindById(
      _id,
      organization._id,
    );
    if (!businessUnit) throw new Error("Business Unit doesn't exist");

    const deletedResult = await BusinessUnits.customDelete(
      { _id },
      user._id,
      organization._id,
    );
    return deletedResult;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default deleteBusinessUnit;
