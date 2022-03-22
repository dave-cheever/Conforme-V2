export type IQuestionValue = string | Date | Boolean | IChoice[];

export interface IChoice { label: string, isCorrect: boolean }

export interface IQuestion<IValue> {
  type: 'textConfirm' | 'textMultilineConfirm' | 'switch' | 'datepicker' | 'multipleChoice';
  name: string;
  description?: string;
  value?: IValue;
  required?: boolean;
  requiredAnswer?: string;
  notApplicable?: boolean;
  outdated?: boolean;
}
