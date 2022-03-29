import { IAuditSection, IBase, TFrequency } from 'app-interfaces';

export interface IAuditType extends IBase {
  name: string;
  frequency: TFrequency;
  sections: IAuditSection[];
  view: 'categorized' | 'singlePage';
  organizationId: String;
}
