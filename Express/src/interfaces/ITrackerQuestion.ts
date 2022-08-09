import { TQuestionType } from 'app-interfaces';

export interface ITrackerQuestion<ValueType> {
  type: TQuestionType;
  name: string;
  description?: string;
  options?: { label: string, value: string }[];
  value?: ValueType;
  required?: boolean;
  notApplicable?: Boolean;
  requiredAnswer?: string | string[];
}
