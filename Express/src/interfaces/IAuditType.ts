import { IAuditSection, IBase, IQuestionsCategory, TFrequency } from 'app-interfaces';

export interface IAuditType extends IBase {
  name: string;
  frequency: TFrequency;
  startingDate: Date;
  view: 'categorized' | 'singlePage';
  recurring: boolean;
  sections: IAuditSection[];

  // Additional fields
  questionsCategories: IQuestionsCategory[];
}
