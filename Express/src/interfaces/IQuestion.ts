export type IQuestionValue = string | Date | Boolean | IChoice[] | null;

export interface IChoice { label: string, isCorrect: boolean }

export interface IQuestion<IValue> {
  type: 'textConfirm' | 'textMultilineConfirm' | 'toggle' | 'datepicker' | 'multipleChoice';
  name: string;
  description?: string;
  value?: IValue;
  required?: Boolean;
  outdated?: boolean;
}

