import React from 'react';

import { IField } from '../../interfaces/IField';
import DataGrid from './DataGrid';
import {
  Checkbox,
  Datepicker,
  Dropdown,
  MultipleChoices,
  NumberInput,
  Switch,
  Textarea,
  TextConfirmInput,
  TextInput,
  TextMultilineConfirmInput,
  Toggle,
} from './index';
import Table from './Table';

const Field = ({ control, ...field }) => {
  const {
    type,
    name,
    label,
    tooltip,
    disabled,
    options,
    validations,
    headings,
    variant,
    placeholder,
    help,
    styles,
    required,
    defaultvalue,
    requiredAnswer,
    notApplicable,
  } = field;
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
    requiredAnswer,
    defaultvalue,
    notApplicable,
  };

  switch (type) {
    case 'text': {
      return <TextInput key={name} {...props} />;
    }
    case 'url': {
      return <TextInput
        key={name}
        {...props}
        isUrl
        validations={{
          isUrl: true,
        }} />;
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
    case 'textMultiline': {
      return <Textarea key={name} {...props} />;
    }
    case 'switch': {
      return <Switch key={name} {...props} />;
    }
    case 'multipleChoice': {
      return <MultipleChoices {...props} />;
    }
    case 'toggle': {
      return <Toggle key={name} {...props} />;
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
      return (
        <div>
          Field "{name}" of type "{type}" is not supported
        </div>
      );
  }
};

export default Field;
