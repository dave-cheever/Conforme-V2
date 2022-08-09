
import { TQuestionType } from './TQuestionType';

export interface ITrackerQuestion<ValueType> {
  type: TQuestionType;
  name: string;
  description?: string;
  value?: ValueType;
  options?: { label: string, value: string }[];
  required?: boolean;
  requiredAnswer?: string | string[];
  notApplicable?: boolean;
}
