import { IAuditSection, IBase, TFrequency } from 'app-interfaces';

export interface IAuditType extends IBase {
  name: string;
  frequency: TFrequency;
  startingDate: Date;
  view: 'categorized' | 'singlePage';
  sections: IAuditSection[];
}
