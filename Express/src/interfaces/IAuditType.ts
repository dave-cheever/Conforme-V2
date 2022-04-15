import { IAuditSection, IBase, TFrequency } from 'app-interfaces';

export interface IAuditType extends IBase {
  name: string;
  frequency: TFrequency;
  startingDate: Date;
  sections: IAuditSection[];
  view: 'categorized' | 'singlePage';
  organizationId: String;
}
