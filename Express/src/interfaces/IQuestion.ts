import { IBase, IScope, TQuestionType } from 'app-interfaces';

export interface IQuestion<ValueType> extends IBase {
  type: TQuestionType;
  question: string;
  description?: string;
  questionsCategoryId?: string;
  required?: boolean;
  notApplicable?: boolean;
  positiveValue?: ValueType;
  negativeValue?: ValueType;

  // Pre-defined questions created by admins has "component" defined (e.g. "audits" as module type) as doesn't belong to any specific audit
  // Custom questions created by users has "type" (e.g. "audit" as collection name) and "_id" defined as belong to specific audit
  scope: IScope;
}
