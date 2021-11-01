import React from 'react';

import {
  Checkbox,
  DataGrid,
  DatePicker,
  Dropdown,
  Number,
  RichTextEditor,
  Table,
  Text,
  Textarea,
  Radio,
  TextWithConfirm
} from './FormControls';
import {
  IFormField,
  IFormFieldOption,
  IFormFieldHeadings,
  IFormFieldValidations,
} from '../interfaces/IForm';
import Form from '../models/form';
import PeoplePicker from './FormControls/PeoplePicker';

export interface IFieldComponent {
  name: string;
  label: string | undefined;
  showDot?: boolean | undefined;
  tooltip?: string;
  disabled?: boolean;
  content?: string;
  options?: IFormFieldOption[];
  headings?: IFormFieldHeadings;
  value: any;
  error?: string;
  touched?: boolean;
  validations?: IFormFieldValidations;
  onChange: (any: any) => void;
  onBlur: (any: any) => void;
  upload?: (any: any) => Promise<any>;
  remove?: (any: any) => Promise<any>;
  placeholder?: string;
  style?: any;
  variant?: string;
}

// onChange parameter can pass custom functionality on field change, remember to call formik.handleChange in it
const Field = ({ key, form, onChange }: { key: string, form: Form, onChange?: (event: any) => void }) => {
  const { values, errors, touched } = form;
  const field = form.getField(key)!;
  const { type, name, label, showDot, tooltip, disabled, content, headings, options, validations, placeholder, style, variant } = field;
  const props: IFieldComponent = {
    name,
    label,
    showDot,
    tooltip,
    disabled,
    content,
    options,
    headings,
    validations,
    placeholder,
    style,
    variant,
    value: values[name],
    error: errors[name],
    touched: touched[name],
    onChange: onChange || form.handleChange.bind(form),
    onBlur: form.handleBlur.bind(form)
  };

  switch (type) {
    case 'checkbox': {
      return <Checkbox key={name} {...props} />;
    }
    case 'dataGrid': {
      return <DataGrid key={name} {...props} />;
    }
    case 'datePicker': {
      return <DatePicker key={name} {...props} />;
    }
    case 'dropdown': {
      return <Dropdown key={name} {...props} />;
    }
    case 'number': {
      return <Number key={name} {...props} />;
    }
    case 'peoplePicker': {
      return <PeoplePicker key={name} {...props} />;
    }
    case 'richTextEditor': {
      return <RichTextEditor key={name} {...props} />;
    }
    case 'table': {
      return <Table key={name} {...props} />;
    }
    case 'text': {
      return <Text key={name} {...props} />;
    }
    case 'textWithConfirm': {
      return <TextWithConfirm key={name} {...props} />;
    }
    case 'textarea': {
      return <Textarea key={name} {...props} />;
    }
    case 'radio': {
      return <Radio key={name} {...props} ></Radio>;
    }
    default:
      return <div>Field not supported</div>;
  }
};

export default Field;
