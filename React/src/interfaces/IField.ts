import { Validations } from "./Validations";

export interface IField {
  control: any;
  name: string;
  label?: string;
  tooltip?: string;
  validations?: Validations;
  disabled?: boolean;
}
