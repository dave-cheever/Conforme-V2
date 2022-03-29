import { IForm, IFormField, IFormFieldOption } from '../interfaces/IForm';

class Form {
  id: number;

  private name: IForm['name'];

  private label: IForm['label'];

  private description: IForm['description'];

  private fields: IFormField[];

  private formik;

  public get values() {
    return this.formik.values;
  }

  public get errors() {
    return this.formik.errors;
  }

  public get touched() {
    return this.formik.touched;
  }

  constructor({ name, label, description, fields }: IForm, formik) {
    this.id = Math.random();
    this.name = name;
    this.label = label;
    this.description = description;
    this.fields = fields;
    this.formik = formik;
  }

  // Getters

  getFields() {
    return this.fields;
  }

  getField(fieldName: string) {
    return this.fields.find(({ name }) => name === fieldName);
  }

  getFieldOptions(fieldName: string) {
    const field = this.getField(fieldName);
    if (!field) return [];

    return field.options;
  }

  getLableFromFieldOptions(fieldName: string, valueId: string) {
    const field = this.getField(fieldName);
    if (!field) return [];

    let lableOftheSelectedItem: IFormFieldOption | undefined;

    if (field.type === 'dropdown') {
      lableOftheSelectedItem = field.options?.find(
        (option) => option.value === valueId,
      );
    }
    return lableOftheSelectedItem ? lableOftheSelectedItem.label : '';
  }

  // Setters

  addField(field: IFormField) {
    this.fields.push(field);
  }

  removeField(fieldName: string) {
    const index = this.fields.findIndex(({ name }) => name === fieldName);
    this.fields.splice(index);
  }

  removeFields() {
    for (const field of this.fields) this.removeField(field.name);
  }

  setEnablement(isEnable: boolean) {
    this.fields.forEach((field) => {
      // eslint-disable-next-line no-param-reassign
      field.disabled = !isEnable;
    });
  }

  setFieldOptions(fieldName: string, options: IFormFieldOption[]) {
    const field = this.getField(fieldName);
    if (!field) return false;

    field.options = options;
    return true;
  }

  touchAll() {
    this.formik.setTouched(
      this.getFields().reduce(
        (acc, field) => ({ ...acc, [field.name]: true }),
        {},
      ),
    );
  }

  // Formik methods

  setFieldValue(fieldName: string, value) {
    this.formik.setFieldValue(fieldName, value);
  }

  setValues(values) {
    this.formik.setValues(values);
  }

  notTouchAll() {
    this.formik.setTouched(
      this.getFields().reduce(
        (acc, field) => ({ ...acc, [field.name]: false }),
        {},
      ),
    );
  }

  handleChange(event) {
    this.formik.handleChange(event);
  }

  handleBlur(event) {
    this.formik.handleBlur(event);
  }
}

export default Form;
