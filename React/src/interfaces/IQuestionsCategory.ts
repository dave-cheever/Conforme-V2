import { IAuditOption } from './IAuditOption';
import { IBase } from './IBase';
import { IScope } from './IScope';

export interface IQuestionsCategory extends IBase {
  name: string;

  /** Define if questions can have answers */
  withAnswers: boolean;

  /** Define if custom questions can be added to this category */
  allowCustomQuestions: boolean;

  /** Define maximum number of questions that can be added to this category */
  maxQuestionsNumber: number;

  /** Define if user can edit questions and answers after an audit was submitted */
  notBlockedAfterCompletion: boolean;

  /** Define if status is used in answers for this category */
  useStatus: boolean;

  /** Define if question category should be displayed in insights */
  showInInsights: boolean;

  /** Define if answers in question category should be counted in audit card */
  countInAuditCard: boolean;

  icon: string;
  options: IAuditOption[];
  scope: IScope;
  organizationId: string;
}
