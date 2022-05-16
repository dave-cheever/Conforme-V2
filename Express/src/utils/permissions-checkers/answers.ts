import { IAnswer, IOrganization, IUser } from 'app-interfaces';
import { Audits } from 'app-models';
import { isPermitted } from 'app-utils';

const checkAnswerPermission = async ({
  user,
  answer,
  organization,
  permissionAction,
}: {
  user: IUser;
  answer: IAnswer;
  organization: IOrganization;
  permissionAction: 'add' | 'edit' | 'delete';
}) => {
  if (answer.scope.type === 'audit') {
    const audit = await Audits.customFindById(answer.scope._id!, organization._id);
    return isPermitted({
      user,
      action: `answers.${permissionAction}`,
      data: { answer, audit },
    });
  }
  return isPermitted({ user, action: `answers.${permissionAction}` });
};

export default checkAnswerPermission;
