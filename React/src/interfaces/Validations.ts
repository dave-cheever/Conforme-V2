export type ValidationValue = string | number | boolean | Function;

export type Validations = {
  [name: string]: ValidationValue;
}

export type DefinedValidations = {
  [name: string]: (label: string, validationValue: ValidationValue, value: any) => string | undefined;
}
