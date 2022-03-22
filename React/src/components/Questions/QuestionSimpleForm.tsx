import { useEffect, useState } from "react";
import { useRadioGroup, HStack, Button, Flex, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { isEmpty } from "lodash";

import { IQuestionFormBase } from "../../interfaces/IQuestionFormBase";
import { questionHeader } from "../../utils/helpers";
import TextInput from "../Forms/TextInput";
import Checkbox from '../Forms/Checkbox';
import Textarea from '../Forms/Textarea';
import { useComplianceItemModalContext } from "../../contexts/ComplianceItemModalProvider";
import CustomRadioButton from "../CustomRadioButton";
import { SwitchOptions } from "../../bootstrap/config";

const QuestionSimpleForm = ({
  questionType,
  editQuestionIndex,
  editableValue,
  addOrUpdateQuestion,
  setShowQuestionForm,
  setIsEdit,
  setEditQuestionIndex,
  setEditQuestion,
}: IQuestionFormBase<string>) => {

  const { complianceItem } = useComplianceItemModalContext();
  const {
    control,
    formState: { errors },
    watch,
    getValues,
    setValue,
    reset
  } = useForm({
    mode: "all",
    defaultValues: {
      name: '',
      description: '',
      required: false,
      ...(questionType === "switch" && { requiredAnswer: "", notApplicable: false })
    },
  });

  const [questionName, required, notApplicable] = watch(['name', "required", "notApplicable"]);
  const [selectedRadio, setSelectedRadio] = useState<string>("");

  const questionAlreadyExist = (complianceItem.questions || []).findIndex(({ name }, index) => {
    if (editQuestionIndex === index && name === questionName) return false;
    return name === questionName;
  }) > -1;

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "questions",
    value: selectedRadio,
    onChange: setSelectedRadio,
  });

  useEffect(() => {
    switch (selectedRadio) {
      case "yes":
        setValue("requiredAnswer", "yes");
        setValue("required", true);
        setValue("notApplicable", false);
        break;
      case "no":
        setValue("requiredAnswer", "no");
        setValue("required", true);
        setValue("notApplicable", false);
        break;
    }
  }, [selectedRadio, setValue])

  useEffect(() => {
    if (notApplicable) {
      setValue("required", false);
      setSelectedRadio("");
    }
  }, [notApplicable, setValue])

  useEffect(() => {
    if (!isEmpty(editableValue)) {
      reset({
        name: editableValue.name,
        description: editableValue.description,
        required: editableValue.required,
        requiredAnswer: editableValue.requiredAnswer,
        notApplicable: editableValue.notApplicable
      });
      setSelectedRadio(editableValue.requiredAnswer || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(editableValue)])

  useEffect(() => {
    if (!questionName) return;

    if (required === false || notApplicable) {
      setSelectedRadio("");
    }
  }, [required, questionName, notApplicable])

  const group = getRootProps();

  return (
    <>
      <Flex alignItems="center" mb='20px'>
        <Text fontWeight="bold" fontSize="smm">
          {questionHeader(questionType)}
        </Text>
      </Flex>
      <TextInput
        control={control}
        name="name"
        label="Question title"
        variant="secondaryVariant"
        placeholder="e.g. where is the tv?"
        validations={{
          notEmpty: true,
        }}
      />
      <Textarea
        control={control}
        name="description"
        variant="secondaryVariant"
        label="Description"
      />
      <Checkbox
        control={control}
        name="required"
        variant="secondaryVariant"
        label="Answer is required"
        disabled={notApplicable}
      />
      {questionType === 'switch' &&
        <>
          <HStack {...group} alignItems="flex-start" spacing="20px">
            <Text>Compliant answer is:</Text>
            {SwitchOptions.map(({ value, label }) => {
              const radio = getRadioProps({ value });
              return (
                <CustomRadioButton key={value} {...radio} fontSize="smm">
                  {label}
                </CustomRadioButton>
              )
            })}
          </HStack>
          <Checkbox
            control={control}
            name="notApplicable"
            variant="secondaryVariant"
            label="NA answer permitted"
          />
        </>
      }
      <Flex justifyContent="space-between" mt='15px'>
        <Button
          bg="questionsSimple.form.button.primary.bg"
          color="questionsSimple.form.button.primary.font"
          fontSize="sm"
          fontWeight="medium"
          h="27px"
          p="17px"
          onClick={() => {
            const question = getValues();
            addOrUpdateQuestion({ type: questionType, ...question });
            setShowQuestionForm(false);
          }}
          disabled={questionAlreadyExist || Object.keys(errors).length > 0 || !questionName}
          title={questionAlreadyExist ? "This question already exist" : ''}
        >
          Save question
        </Button>
        <Button
          bg="questionsSimple.form.button.secondary.bg"
          color="questionsSimple.form.button.secondary.font"
          opacity="0.5"
          fontSize="sm"
          fontWeight="medium"
          h="27px"
          p="17px"
          onClick={() => {
            setShowQuestionForm(false);
            setIsEdit(false);
            setEditQuestionIndex(undefined);
            setEditQuestion('');
          }}
        >
          Cancel
        </Button>
      </Flex>
    </>
  )
}

export default QuestionSimpleForm

export const questionSimpleFormStyles = {
  questionsSimple: {
    form: {
      icon: '#2B3236',
      button: {
        primary: {
          bg: '#462AC4',
          font: '#FFFFFF',
        },
        secondary: {
          bg: '#9A9EA1',
          font: '#FFFFFF',
        },
      }
    },
  },
};
