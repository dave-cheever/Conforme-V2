import { IAuditSection, IBase, IQuestionsCategory, TFrequency } from 'app-interfaces';

export interface IAuditType extends IBase {
  name: string;
  frequency: TFrequency;
  startingDate: Date;
  view: 'categorized' | 'singlePage';
  recurring: boolean;
  sections: IAuditSection[];

  /**
   * Defines the scope of Business Unit in audit.
   * If "audit" then during audit creation user will have to pick Business Unit.
   * If "answer" then during answer creation user will have to pick Business Unit.
   */
  businessUnitScope?: 'audit' | 'answer';

  // Additional fields
  questionsCategories: IQuestionsCategory[];
}
