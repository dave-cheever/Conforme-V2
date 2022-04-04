import { Actions } from 'app-models';
import { isPermitted } from 'app-utils';

const createAction = async (_, { action }, { authorize, organization }) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: 'actions.add' }))
      throw new Error('User is not permitted');

    const createdAction = await Actions.customCreate(
      action,
      user._id,
      organization._id,
    );

    return createdAction;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default createAction;
