import { Validations } from "./Validations";

export interface IField {
  control: any;
  name: string;
  label?: string;
  tooltip?: string;
  validations?: Validations;
  disabled?: boolean;
  required?: boolean;
  options?: any[];
  variant?: string;
  help?: string;
  placeholder?: string;
}
