export type TValidationValue = string | number | boolean | Function | string[];

export type TValidations = {
  [name: string]: TValidationValue;
};

export type TDefinedValidations = {
  [name: string]: (
    label: string,
    validationValue: TValidationValue,
    value: any,
    prevValue?: any
  ) => string | undefined;
};
