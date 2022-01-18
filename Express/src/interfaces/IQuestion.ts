export type IQuestionValue = string | Date | Boolean | IChoice[];

export interface IChoice { label: string, isCorrect: boolean }

export interface IQuestion<IValue> {
  type: 'text' | 'textMultiline' | 'toggle' | 'datepicker' | 'multipleChoice';
  name: string;
  description?: string;
  value?: IValue;
  required?: Boolean;
  outdated?: boolean;
}

