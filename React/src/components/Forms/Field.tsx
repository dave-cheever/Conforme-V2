import React from 'react';

import {
  Checkbox,
  Dropdown,
  Datepicker,
  NumberInput,
  Switch,
  Textarea,
  TextConfirmInput,
  TextMultilineConfirmInput,
  TextInput,
  Toggle,
  MultipleChoices,
} from './index';
import { IField } from '../../interfaces/IField';
import Table from './Table';
import DataGrid from './DataGrid';

const Field = ({ control, ...field }) => {
  const { type, name, label, tooltip, disabled, options, validations, headings, variant, placeholder, help, styles, required, defaultvalue } = field;
  const props: IField = {
    control,
    name,
    label,
    disabled,
    options,
    validations,
    headings,
    placeholder,
    variant,
    tooltip,
    help,
    styles,
    required,
    defaultvalue,
  };

  switch (type) {
    case 'text': {
      return <TextInput key={name} {...props} />;
    }
    case 'dropdown': {
      return <Dropdown key={name} {...props} />;
    }
    case 'number': {
      return <NumberInput key={name} {...props} />;
    }
    case 'datepicker': {
      return <Datepicker key={name} {...props} />;
    }
    case 'textarea': {
      return <Textarea key={name} {...props} />;
    }
    case 'switch': {
      return <Switch key={name} {...props} />
    }
    case 'multipleChoice': {
      return <MultipleChoices {...props} />
    }
    case 'toggle': {
      return <Toggle key={name} {...props} />
    }
    case 'checkbox': {
      return <Checkbox key={name} {...props} />;
    }
    case 'textConfirm': {
      return <TextConfirmInput key={name} {...props} />;
    }
    case 'textMultilineConfirm': {
      return <TextMultilineConfirmInput key={name} {...props} />;
    }
    case 'table': {
      return <Table key={name} {...props} />;
    }
    case 'dataGrid': {
      return <DataGrid key={name} {...props} />;
    }
    default:
      return <div>Field "{name}" of type "{type}" is not supported</div>;
  }
};

export default Field;
