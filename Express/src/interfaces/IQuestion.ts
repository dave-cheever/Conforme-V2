export interface IQuestion {
  type: 'textWithConfirm' | 'toggle' | 'datePicker';
  name: string;
  description?: string;
  value?: string | boolean | Date;
  required?: boolean;
  outdated?: boolean;
}
