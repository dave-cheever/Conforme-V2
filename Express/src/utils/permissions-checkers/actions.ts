import { IAction, IOrganization, IUser } from 'app-interfaces';
import { Answers, Audits } from 'app-models';
import { isPermitted } from 'app-utils';

const checkActionPermission = async ({
  user,
  action,
  organization,
  permissionAction,
}: {
  user: IUser;
  action: IAction;
  organization: IOrganization;
  permissionAction: 'add' | 'edit' | 'delete';
}) => {
  if (action.scope.type === 'answer') {
    const answer = await Answers.customFindById(action.scope._id!, organization._id);
    if (answer.scope.type === 'audit') {
      const audit = await Audits.customFindById(answer.scope._id!, organization._id);
      return isPermitted({
        user,
        action: `actions.${permissionAction}`,
        data: { action, answer, audit },
      });
    }
  }
  return isPermitted({ user, action: `actions.${permissionAction}` });
};

export default checkActionPermission;
