import { IAuditSection } from './IAuditSection';
import { IBase } from './IBase';
import { IQuestionsCategory } from './IQuestionsCategory';
import { TFrequency } from './TFrequency';

export interface IAuditType extends IBase {
  name: string;
  frequency: TFrequency;
  view: 'categorized' | 'singlePage';
  startingDate: Date;
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
