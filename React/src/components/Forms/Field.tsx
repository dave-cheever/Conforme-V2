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
} from './index';
import { IField } from '../../interfaces/IField';

const Field = ({ control, ...field }) => {
  const { type, name, label, tooltip, disabled, options, validations, variant, placeholder, help, styles, required } = field;
  const props: IField = {
    control,
    name,
    label,
    disabled,
    options,
    validations,
    placeholder,
    variant,
    tooltip,
    help,
    styles,
    required
  };

  switch (type) {
    case 'text': {
      return <TextInput key={name} {...props} />;
    }
    case 'textMultiline': {
      return <TextMultilineConfirmInput key={name} {...props} />;
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
    case 'toggle': {
      return <Toggle key={name} {...props} />
    }
    case 'checkbox': {
      return <Checkbox key={name} {...props} />;
    }
    case 'textConfirmInput': {
      return <TextConfirmInput key={name} {...props} />;
    }
    case 'textMultilineConfirmInput': {
      return <TextMultilineConfirmInput key={name} {...props} />;
    }
    default:
      return <div>Field not supported</div>;
  }
};

export default Field;
