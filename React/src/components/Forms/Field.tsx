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
      return <TextInput data-id="ceb2b6282548" key={name} {...props} />;
    }
    case 'url': {
      return (
        (<TextInput
          data-id="27682f064065"
          key={name}
          {...props}
          isUrl
          validations={{
            isUrl: true,
          }} />)
      );
    }
    case 'dropdown': {
      return <Dropdown data-id="bee14bf96189" key={name} {...props} />;
    }
    case 'number': {
      return <NumberInput data-id="3a857fa92716" key={name} {...props} />;
    }
    case 'datepicker': {
      return <Datepicker data-id="1eb3a3aa7fdf" key={name} {...props} />;
    }
    case 'textMultiline': {
      return <Textarea data-id="f846e9282120" key={name} {...props} />;
    }
    case 'switch': {
      return <Switch data-id="cf95e5961359" key={name} {...props} />;
    }
    case 'multipleChoice': {
      return <MultipleChoices data-id="44f5a7dee7a3" {...props} />;
    }
    case 'singleChoice': {
      return <SingleChoices data-id="015c76511bf4" {...props} />;
    }
    case 'toggle': {
      return <Toggle data-id="b396f70f909d" key={name} {...props} />;
    }
    case 'checkbox': {
      return <Checkbox data-id="134f341fe3ba" key={name} {...props} />;
    }
    case 'textConfirm': {
      return <TextConfirmInput data-id="b3cf2e97400a" key={name} {...props} />;
    }
    case 'textMultilineConfirm': {
      return <TextMultilineConfirmInput data-id="3dd2ce1bf37d" key={name} {...props} />;
    }
    case 'table': {
      return <Table data-id="6b64afb386f7" key={name} {...props} />;
    }
    case 'dataGrid': {
      return <DataGrid data-id="f3f2d4f975cc" key={name} {...props} />;
    }
    default:
      return (<div data-id="99eba1af74d6">Field "{name}" of type "{type}" is not supported</div>);
  }
}

export default Field;
