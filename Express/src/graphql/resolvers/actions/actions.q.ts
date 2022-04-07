import { Actions } from 'app-models';
import { priorities } from 'app-utils';

const actions = async (_, __, { organization }) => {
  try {
    const actions = await Actions.customFind({}, organization._id);
    return actions.sort(
      (a, b) => priorities[a.priority] - priorities[b.priority],
    );
  } catch (err: any) {
    throw new Error(err);
  }
};

export default actions;
