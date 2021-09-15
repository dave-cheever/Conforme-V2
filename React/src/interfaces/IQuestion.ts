export interface IQuestion {
  type: 'textWithConfirm' | 'toggle' | 'datePicker';
  name: string;
  description?: string;
  value?: string | Boolean | Date;
  required: Boolean;
}