export type IQuestionValue = string | Date | Boolean | IChoice[] | null;

export interface IChoice { label: string, isCorrect: boolean }

export interface IQuestion<IValue> {
  type: 'text' | 'textMultiline' | 'switch' | 'datepicker' | 'multipleChoice';
  name: string;
  description?: string;
  value?: IValue;
  required?: Boolean;
  notApplicable?: Boolean;
  requiredAnswer?: String;
  outdated?: boolean;
}

