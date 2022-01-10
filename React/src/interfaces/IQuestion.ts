interface IChoice { label: string, isCorrect: boolean }
export interface IQuestion {
  type: 'text' | 'textMultiline' | 'switch' | 'datepicker' | 'multipleChoice';
  name: string;
  description?: string;
  value?: string | Boolean | Date | IChoice ;
  required?: Boolean;
  outdated?: boolean;
  choices?: {
    label: string,
    isCorrect: boolean
  }[]
}
