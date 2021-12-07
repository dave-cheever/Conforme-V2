import { IBase } from "app-interfaces";

export interface ISetting extends IBase {
  name: string;
  value: any;
  label: string;
  type: string;
  description: string;
  options?: string[];
  organizationId: string;
  placeholder?: string;
  inputType: string;
}
