import Checkbox from './Checkbox';
import DataGrid from './DataGrid';
import DatePicker from './DatePicker';
import Dropdown from './Dropdown';
import Number from './Number';
import RichTextEditor from './RichTextEditor';
import Table from './Table';
import Text from './Text';
import TextWithConfirm from './TextWithConfirm';
import Textarea from './Textarea';
import Radio from './Radio';

export {
  Checkbox,
  DataGrid,
  DatePicker,
  Dropdown,
  Number,
  RichTextEditor,
  Table,
  Text,
  TextWithConfirm,
  Textarea,
  Radio,
};

export interface IFormFile {
  name: string;
  url: string;
}

export interface IFormValidations {
  minLength?: number;
  maxLength?: number;
  notEmpty?: boolean;
  regex?: string;
  equals?: string | number | boolean;
  forceMaxLength?: boolean;
}

export interface IFormHeadingOption {
  label: string;
  name: string;
  type: 'text' | 'number' | 'dropdown';
  options: string[];
}

export interface IFormHeadings {
  colsLabel?: string;
  cols: IFormHeadingOption[];
  rowsLabel?: string;
  rows?: {
    name: string;
    label: string;
  }[];
}
export interface IFormOption {
  value: string | number;
  label: string;
}
