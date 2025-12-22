import { ActionTemplates } from 'app-models';
import { isPermitted } from 'app-utils';

const deleteActionTemplate = async (_, { _id }, { authorize, organization }) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: 'actionTemplates.delete' })) throw new Error('User is not permitted to delete this action template.');

    const actionTemplate = await ActionTemplates.customFindById(_id, organization._id);
    if (!actionTemplate) {
      throw new Error("Action template doesn't exist");
    }

    const deletedResult = await ActionTemplates.customDelete({ _id }, user.userId, organization._id);

    return deletedResult > 0;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default deleteActionTemplate;

