import { IOrganization, IQuestion, IUser } from 'app-interfaces';
import { Audits, QuestionsCategories } from 'app-models';
import { isPermitted } from 'app-utils';

const checkQuestionPermission = async ({
  user,
  question,
  organization,
  permissionAction,
}: {
  user: IUser;
  question: IQuestion<any>;
  organization: IOrganization;
  permissionAction: 'add' | 'edit' | 'delete';
}) => {
  if (question.questionsCategoryId) {
    const questionsCategory = await QuestionsCategories.customFindById(question.questionsCategoryId, organization._id);
    if (question.scope.type === 'audit') {
      const audit = await Audits.customFindById(question.scope._id!, organization._id);
      return isPermitted({
        user,
        action: `questions.${permissionAction}`,
        data: { question, audit, questionsCategory },
      });
    }
  }
  return isPermitted({ user, action: `questions.${permissionAction}` });
};

export default checkQuestionPermission;
