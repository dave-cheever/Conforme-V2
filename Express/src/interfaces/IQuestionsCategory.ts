import { IAuditOption, IBase, IScope } from 'app-interfaces';

export interface IQuestionsCategory extends IBase {
  name: string;
  withAnswers: boolean; // Defines if questions can have answers
  allowCustomQuestions: boolean; // Defines if custom questions can be added to this category
  maxQuestionsNumber: number; // Defines maximum number of questions that can be added to this category
  notBlockedAfterCompletion: boolean; // Defines if user can edit questions and answers after an audit was submitted
  useStatus: boolean; // Defines status is used in answers for this category
  showInInsights: boolean;
  icon: string;
  options: IAuditOption[];
  scope: IScope;
  organizationId: string;
}
