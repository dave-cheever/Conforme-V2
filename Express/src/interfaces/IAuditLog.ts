import { IBase } from 'app-interfaces';

export type IAuditLogAction =
  | 'add'
  | 'update'
  | 'delete'
  | 'search'
  | 'snapshot';

export interface IAuditLogElement {
  _id: string;
  name: string;
  self_id?: string; // Used if element is foreign element
}

export interface IAuditFieldValue {
  value: string | string[] | object;
  label: string;
}

export interface IAuditValue {
  old?: IAuditFieldValue;
  new?: IAuditFieldValue;
};

export interface IAuditValues {
  [field: string]: IAuditValue;
}

export interface IAuditLog extends IBase {
  action: IAuditLogAction;
  element: IAuditLogElement;
  coll: string;
  values: IAuditValues;
  organizationId: string;
}
