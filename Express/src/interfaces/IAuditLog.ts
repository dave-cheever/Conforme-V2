import { IBase } from "app-interfaces";

export type IAuditLogAction = "add" | "update" | "delete" | "search";

export interface IAuditLogElement {
  _id: string;
  name: string;
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

export interface IAuditLog extends IBase {
  action: IAuditLogAction;
  element: IAuditLogElement;
  coll: string;
  values: IAuditValues;
}
