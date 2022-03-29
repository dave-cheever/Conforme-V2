export interface IFormFieldValidations {
  minElements?: number;
  minLength?: number;
  maxLength?: number;
  notEmpty?: boolean;
  numberOnly?: boolean;
  regex?: RegExp;
  equals?: string | number | boolean;
  forceMaxLength?: boolean;
  required?: boolean;
}

export interface IFormFieldHeadingOption {
  label: string;
  name: string;
  type: 'text' | 'number' | 'dropdown';
  options: string[];
}

export interface IFormFieldHeadings {
  colsLabel?: string;
  cols: IFormFieldHeadingOption[];
  rowsLabel?: string;
  rows?: {
    name: string;
    label: string;
  }[];
}

export interface IFormFieldOption {
  value: string | number;
  label: string;
}

export interface IFormField {
  type:
    | 'checkbox'
    | 'colorPicker'
    | 'dataGrid'
    | 'datePicker'
    | 'dropdown'
    | 'number'
    | 'peoplePicker'
    | 'richTextEditor'
    | 'richTextViewer'
    | 'select'
    | 'table'
    | 'text'
    | 'textWithConfirm'
    | 'textarea'
    | 'toggle'
    | 'upload'
    | 'radio';
  name: string;
  label?: string;
  disabled?: boolean;
  showDot?: boolean;
  validations?: IFormFieldValidations;
  headings?: IFormFieldHeadings;
  options?: IFormFieldOption[];
  content?: string;
  tooltip?: string;
  placeholder?: string;
  style?: any;
  variant?: string;
}

export interface IForm {
  name: string;
  label: string;
  description?: string;
  fields: IFormField[];
}
