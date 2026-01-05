import { ActionTemplates } from 'app-models';
import { isPermitted } from 'app-utils';

const updateActionTemplate = async (_, { actionTemplateInput }, { authorize, organization }) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: 'actionTemplates.edit' })) {
      throw new Error('User is not permitted to update this action template.');
    }

    const actionTemplate = await ActionTemplates.customFindById(actionTemplateInput._id, organization._id);
    if (!actionTemplate) {
      throw new Error("Action template doesn't exist");
    }

    const updatedActionTemplate = await ActionTemplates.customUpdateOne(
      { _id: actionTemplate._id },
      actionTemplateInput,
      user.userId,
      organization._id,
    );

    return updatedActionTemplate;
  } catch (err: any) {
    if (err.message) {
      throw new Error(err.message);
    }
    throw new Error(err);
  }
};

export default updateActionTemplate;

