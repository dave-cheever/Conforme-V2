import { TDefinedValidations, TValidations } from "../interfaces/TValidations";

const useValidate = (label: string, validations: TValidations, definedValidations: TDefinedValidations, initialValue?: string) => {
  const validationsTypes = Object.keys(validations);
  if (validationsTypes.length === 0) {
    return undefined;
  }

  // Build react-form-hook validate object
  // Iterate over validations specified for field
  const validate = validationsTypes.reduce((acc, validationType) => {
    const validationValue = validations[validationType];

    // If validation value is a function, just set it
    if (typeof validationValue === 'function') {
      return {
        ...acc,
        [validationType]: validationValue,
      };
    }

    // Get validations defined for field
    const definedValidation = definedValidations[validationType];
    if (!definedValidation) {
      console.warn(`There is no defined validation of type ${validationType} for ${label} field`)
      return acc;
    }

    // Get validation function defined for field
    const validationFunction = value => definedValidation(label, validationValue, value, initialValue);
    return {
      ...acc,
      [validationType]: validationFunction,
    };
  }, {});
  return validate;
};

export default useValidate;
