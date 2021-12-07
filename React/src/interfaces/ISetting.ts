import { IBase } from "./IBase";

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
  variant?: string;
  help?: string;
}
