import { IAuditSection } from './IAuditSection';
import { IBase } from './IBase';
import { TFrequency } from './TFrequency';

export interface IAuditType extends IBase {
  name: string;
  frequency: TFrequency;
  startingDate: Date;
  sections: IAuditSection[];
  view: 'categorized' | 'singlePage';
}
