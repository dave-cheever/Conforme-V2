import { Actions } from 'app-models';
import { isPermitted } from 'app-utils';

const updateAction = async (
  _,
  { actionInput },
  { authorize, organization }
) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: 'actions.edit', data: actionInput }))
      throw new Error('User is not permitted');

    const action = await Actions.customFindById(
      actionInput._id,
      organization._id
    );
    if (!action) throw new Error("Action doesn't exist");

    const updatedAction = await Actions.customUpdateOne(
      { _id: action._id },
      actionInput,
      user._id,
      organization._id
    );
    return updatedAction;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default updateAction;
