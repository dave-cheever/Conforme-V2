import { IBase, TComponent, TQuestionType } from 'app-interfaces';

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
