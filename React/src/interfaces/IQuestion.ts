import { IBase } from './IBase';
import { TModuleType } from './TModuleType';
import { TQuestionType } from './TQuestionType';

export interface IQuestion<ValueType> extends IBase {
  type: TQuestionType;
  question: string;
  description?: string;
  questionsCategoryId?: string;
  required?: boolean;
  notApplicable?: boolean;
  positiveValue?: ValueType;
  negativeValue?: ValueType;
  scope: {
    component: TModuleType;
    type?: string;
    _id?: string;
  };
  organizationId: string;
}
