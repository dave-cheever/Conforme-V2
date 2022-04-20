import { IAuditOption, IBase, IScope } from 'app-interfaces';

export interface IQuestionsCategory extends IBase {
  name: string;
  withAnswers: boolean;
  allowCustomQuestions: boolean;
  maxQuestionsNumber: number;
  icon: string;
  options: IAuditOption[];
  scope: IScope;
  organizationId: string;
}
