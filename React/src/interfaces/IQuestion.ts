export interface IQuestion {
  type: 'text' | 'switch' | 'datepicker';
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