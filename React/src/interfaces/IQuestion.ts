export interface IQuestion {
  type: 'text' | 'toggle' | 'datePicker';
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