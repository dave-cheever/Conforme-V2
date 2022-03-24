import { IFormFieldHeadings } from "./IForm";
import { TValidations } from "./TValidations";

export interface IField {
  control: any;
  name: string;
  label?: string;
  tooltip?: string;
  validations?: TValidations;
  disabled?: boolean;
  required?: boolean;
  requiredAnswer?: string;
  notApplicable?: boolean;
  options?: any[];
  headings?: IFormFieldHeadings;
  variant?: string;
  help?: string;
  placeholder?: string;
  styles?: object;
  defaultvalue?: any;
}
