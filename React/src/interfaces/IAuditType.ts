import { IAuditOption } from './IAuditOption';
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
  options?: IAuditOption[];

  // Additional fields
  questionsCategories: IQuestionsCategory[];
}
