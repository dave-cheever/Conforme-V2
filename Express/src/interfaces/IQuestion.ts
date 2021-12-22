export interface IQuestion {
  type: 'text' | 'textMultiline' | 'toggle' | 'datePicker' | 'multipleChoice';
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

