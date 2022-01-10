import { IBase } from "./IBase";

export type IAuditLogAction = "add" | "update" | "delete" | "search";

export interface IAuditLogElement {
  _id: string;
  name: string;
  self_id?: string; // Used if element is foreign element
}

export interface IAuditValue {
  value: string | string[];
  label: string;
}

export interface IAuditValues {
  [field: string]: {
    old?: IAuditValue;
    new?: IAuditValue;
  };
}

export interface IAuditLogRecord extends IBase {
  action: IAuditLogAction;
  element: IAuditLogElement;
  coll: string;
  values: IAuditValues;
}

export interface IAuditLog {
  _id: string;
  records: IAuditLogRecord[];
}