import { IBase } from './IBase';
import { TComponent } from './TComponent';
import { TQuestionType } from './TQuestionType';

export interface IQuestion<ValueType> extends IBase {
  type: TQuestionType;
  question: string;
  description?: string;
  category?: string;
  required?: boolean;
  notApplicable?: boolean;
  positiveValue?: ValueType;
  negativeValue?: ValueType;
  scope: {
    component: TComponent;
    type?: string;
    _id?: string;
  };
  organizationId: string;
}
