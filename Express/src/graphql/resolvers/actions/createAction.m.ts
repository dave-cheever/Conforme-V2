import { IAction } from 'app-interfaces';
import { Actions, Audits } from 'app-models';
import { isPermitted } from 'app-utils';

const createAction = async (
  _,
  { action, auditId },
  { authorize, organization }
) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: 'actions.add' }))
      throw new Error('User is not permitted');

    const createdAction = await Actions.customCreate(
      action,
      user._id,
      organization._id
    );
    const parentAudit = await Audits.customFindOne(
      { _id: auditId },
      organization._id
    );
    await Audits.customUpdateOne(
      { _id: parentAudit._id },
      {
        actionsIds: [
          ...parentAudit.answersIds,
          (createdAction as unknown as IAction & { _id: string })._id
        ]
      },
      user._id,
      organization._id
    );

    return createdAction;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default createAction;
