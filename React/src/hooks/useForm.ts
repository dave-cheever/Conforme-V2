import { useFormik } from "formik";

import { IForm } from "../interfaces/IForm";
import Form from "../models/form";
import { getFieldEmptyValue } from "../utils/helpers";
import validateForm from "../utils/validateForm";

const useForm = (formConfig: IForm, initialValues: Object = {}) => {
  const getInitialValues = () => {
    const formikInitialValues = {};

    // If initial values for field is undefined, set it depending on field type
    formConfig.fields.forEach(({ name, type }) => formikInitialValues[name] = initialValues[name] || getFieldEmptyValue(type));
    return formikInitialValues;
  }

  // Initialize formik
  const formik = useFormik({
    initialValues: getInitialValues(),
    onSubmit: () => { },
    validate: values => validateForm(values, formConfig.fields),
    enableReinitialize: false,
  });

  // Initialize form
  const form = new Form(formConfig, formik);

  return {
    form,
    fields: form.getFields(),
  };
};

export default useForm;
