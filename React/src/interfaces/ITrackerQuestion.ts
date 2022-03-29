import { TQuestionType } from './TQuestionType';

export interface ITrackerQuestion<ValueType> {
  type: TQuestionType;
  name: string;
  description?: string;
  value?: ValueType;
  required?: boolean;
  requiredAnswer?: string;
  notApplicable?: boolean;
  outdated?: boolean;
}
