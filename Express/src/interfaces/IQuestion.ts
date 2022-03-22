export type IQuestionValue = string | Date | Boolean | IChoice[] | null;

export interface IChoice { label: string, isCorrect: boolean }

export interface IQuestion<IValue> {
  type: 'textConfirm' | 'textMultilineConfirm' | 'datepicker' | 'multipleChoice' | "switch";
  name: string;
  description?: string;
  value?: IValue;
  required?: Boolean;
  notApplicable?: Boolean;
  requiredAnswer?: String;
  outdated?: boolean;
}

