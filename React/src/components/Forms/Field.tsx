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
      return <TextInput data-id="000260" key={name} {...props} />;
    }
    case 'url': {
      return (
        <TextInput
            data-id="000261"
            key={name}
            {...props}
            isUrl
            validations={{
              isUrl: true,
            }} />
      );
    }
    case 'dropdown': {
      return <Dropdown data-id="000262" key={name} {...props} />;
    }
    case 'number': {
      return <NumberInput data-id="000263" key={name} {...props} />;
    }
    case 'datepicker': {
      return <Datepicker data-id="000264" key={name} {...props} />;
    }
    case 'textMultiline': {
      return <Textarea data-id="000265" key={name} {...props} />;
    }
    case 'switch': {
      return <Switch data-id="000266" key={name} {...props} />;
    }
    case 'multipleChoice': {
      return <MultipleChoices data-id="000267" {...props} />;
    }
    case 'singleChoice': {
      return <SingleChoices data-id="000268" {...props} />;
    }
    case 'toggle': {
      return <Toggle data-id="000269" key={name} {...props} />;
    }
    case 'checkbox': {
      return <Checkbox data-id="000270" key={name} {...props} />;
    }
    case 'textConfirm': {
      return <TextConfirmInput data-id="000271" key={name} {...props} />;
    }
    case 'textMultilineConfirm': {
      return <TextMultilineConfirmInput data-id="000272" key={name} {...props} />;
    }
    case 'table': {
      return <Table data-id="000273" key={name} {...props} />;
    }
    case 'dataGrid': {
      return <DataGrid data-id="000274" key={name} {...props} />;
    }
    default:
      return (<div data-id="000275">Field "{name}" of type "{type}" is not supported</div>);
  }
}

export default Field;
