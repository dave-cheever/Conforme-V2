export interface IQuestion {
  type: 'text' | 'textMultiline' | 'toggle' | 'datepicker' | 'multipleChoice';
  name: string;
  description?: string;
  value?: string | Boolean | Date;
  required?: Boolean;
  outdated?: boolean;
  choices?: {
    label: string,
    isCorrect: boolean
  }[]
}

