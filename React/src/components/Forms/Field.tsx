import React from 'react';

import { IField } from '../../interfaces/IField';
import DataGrid from './DataGrid';
import {
  Checkbox,
  Datepicker,
  Dropdown,
  MultipleChoices,
  NumberInput,
  SingleChoices,
  Switch,
  Textarea,
  TextConfirmInput,
  TextInput,
  TextMultilineConfirmInput,
  Toggle,
} from './index';
import Table from './Table';

function Field({ control, ...field }) {
  const {
    type,
    name,
    label,
    tooltip,
    disabled,
    readMode,
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
    setValue,
  } = field;
  const props: IField = {
    control,
    name,
    label,
    disabled,
    readMode,
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
    setValue,
  };

  switch (type) {
    case 'text': {
      return <TextInput data-id="030925-29927a" key={name} {...props} />;
    }
    case 'url': {
      return (
        <TextInput
            data-id="030925-c39c8d"
            key={name}
            {...props}
            isUrl
            validations={{
              isUrl: true,
            }} />
      );
    }
    case 'dropdown': {
      return <Dropdown data-id="030925-2f1fb3" key={name} {...props} />;
    }
    case 'number': {
      return <NumberInput data-id="030925-d4338e" key={name} {...props} />;
    }
    case 'datepicker': {
      return <Datepicker data-id="030925-09f6ce" key={name} {...props} />;
    }
    case 'textMultiline': {
      return <Textarea data-id="030925-b28f04" key={name} {...props} />;
    }
    case 'switch': {
      return <Switch data-id="030925-472446" key={name} {...props} />;
    }
    case 'multipleChoice': {
      return <MultipleChoices data-id="030925-fbee4b" {...props} />;
    }
    case 'singleChoice': {
      return <SingleChoices data-id="030925-20583a" {...props} />;
    }
    case 'toggle': {
      return <Toggle data-id="030925-ac2b0d" key={name} {...props} />;
    }
    case 'checkbox': {
      return <Checkbox data-id="030925-ccf58c" key={name} {...props} />;
    }
    case 'textConfirm': {
      return <TextConfirmInput data-id="030925-1956cc" key={name} {...props} />;
    }
    case 'textMultilineConfirm': {
      return <TextMultilineConfirmInput data-id="030925-bc1182" key={name} {...props} />;
    }
    case 'table': {
      return <Table data-id="030925-0f9d18" key={name} {...props} />;
    }
    case 'dataGrid': {
      return <DataGrid data-id="030925-3ab451" key={name} {...props} />;
    }
    default:
      return (<div data-id="030925-54669f">Field "{name}" of type "{type}" is not supported</div>);
  }
}

export default Field;
