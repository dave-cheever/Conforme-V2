import { FormikValues } from 'formik';
import { isArray, isObject } from 'lodash';

import { IFormField } from '../interfaces/IForm';

const validateForm = (values: FormikValues, fields: IFormField[]) => {
  if (!values) {
    return {
      noValues: true,
    };
  }
  const errors: Record<string, string> = {};

  fields.forEach(({ name, label, validations }) => {
    if (!validations) return;

    const validationsEntries = Object.entries(validations || {});
    validationsEntries.forEach(([validationName, validationValue]) => {
      switch (validationName) {
        case 'notEmpty':
          if (isArray(values[name])) {
            values[name].forEach((value) => {
              if (!value.removed && (value === undefined || value === '')) errors[name] = `Please complete "${label}"`;
            });
          } else if (!values[name]) errors[name] = `Please complete "${label}"`;

          break;

        case 'numberOnly':
          if (isArray(values[name])) {
            // If value is an array (like in a Table)
            values[name].forEach((value) => {
              if (!value.removed && !new RegExp(/^-?\d+\.?\d*$/).test(value[name]))
                errors[name] = `Please only use numbers in a decimal format`;
            });
          } else if (isObject(values[name]) && !isArray(values[name])) {
            // If value is an object (like in a DataGrid)
            Object.keys(values[name]).forEach((key) => {
              const dataValue = values[name][key];
              if (!dataValue.removed && !new RegExp(/^-?\d+\.?\d*$/).test(dataValue.value))
                errors[name] = `Please only use numbers in a decimal format`;
            });
          } else if (!new RegExp(/^-?\d+\.?\d*$/).test(values[name])) {
            // If value is single value
            errors[name] = `Please only use numbers in a decimal format`;
          }
          break;

        case 'minElements':
          if (values[name].length > 0) {
            values[name].forEach((value) => {
              if (!value || value.length === 0) errors[name] = `At least ${validationValue} element(s) required`;
            });
          } else errors[name] = `At least ${validationValue} element(s) required`;

          break;

        case 'regex':
          if (isArray(values[name])) {
            values[name].forEach((value) => {
              if (!value.removed && !validationValue.test(value[name])) errors[name] = `Wrong format: "${value[name]}"`;
            });
          } else if (!validationValue.test(values[name])) errors[name] = `Wrong format: "${values[name]}"`;

          break;
        default:
          break;
      }
    });
  });

  return errors;
};

export default validateForm;
