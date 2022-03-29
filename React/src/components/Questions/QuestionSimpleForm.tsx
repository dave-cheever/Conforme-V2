import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button, Flex, HStack, Text, useRadioGroup } from '@chakra-ui/react';
import { isEmpty } from 'lodash';

import { SwitchOptions } from '../../bootstrap/config';
import { useComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';
import { IQuestionFormBase } from '../../interfaces/IQuestionFormBase';
import { questionHeader } from '../../utils/helpers';
import CustomRadioButton from '../CustomRadioButton';
import Checkbox from '../Forms/Checkbox';
import Textarea from '../Forms/Textarea';
import TextInput from '../Forms/TextInput';

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
    reset,
  } = useForm({
    mode: 'all',
    defaultValues: {
      name: '',
      description: '',
      required: false,
      ...(questionType === 'switch' && {
        requiredAnswer: '',
        notApplicable: false,
      }),
    },
  });

  const [questionName, required, notApplicable] = watch([
    'name',
    'required',
    'notApplicable',
  ]);
  const [selectedRadio, setSelectedRadio] = useState<string>('');

  const questionAlreadyExist =
    (complianceItem.questions || []).findIndex(({ name }, index) => {
      if (editQuestionIndex === index && name === questionName) return false;
      return name === questionName;
    }) > -1;

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'questions',
    value: selectedRadio,
    onChange: setSelectedRadio,
  });

  useEffect(() => {
    switch (selectedRadio) {
      case 'yes':
        setValue('requiredAnswer', 'yes');
        setValue('required', true);
        setValue('notApplicable', false);
        break;
      case 'no':
        setValue('requiredAnswer', 'no');
        setValue('required', true);
        setValue('notApplicable', false);
        break;
      default:
        break;
    }
  }, [selectedRadio, setValue]);

  useEffect(() => {
    if (notApplicable) {
      setValue('required', false);
      setSelectedRadio('');
    }
  }, [notApplicable, setValue]);

  useEffect(() => {
    if (!isEmpty(editableValue)) {
      reset({
        name: editableValue.name,
        description: editableValue.description,
        required: editableValue.required,
        requiredAnswer: editableValue.requiredAnswer,
        notApplicable: editableValue.notApplicable,
      });
      setSelectedRadio(editableValue.requiredAnswer || '');
    }
  }, [JSON.stringify(editableValue)]);

  useEffect(() => {
    if (!questionName) return;

    if (required === false || notApplicable) setSelectedRadio('');
  }, [required, questionName, notApplicable]);

  const group = getRootProps();

  return (
    <>
      <Flex alignItems="center" mb="20px">
        <Text fontSize="smm" fontWeight="bold">
          {questionHeader(questionType)}
        </Text>
      </Flex>
      <TextInput
        control={control}
        label="Question title"
        name="name"
        placeholder="e.g. where is the tv?"
        validations={{
          notEmpty: true,
        }}
        variant="secondaryVariant"
      />
      <Textarea
        control={control}
        label="Description"
        name="description"
        variant="secondaryVariant"
      />
      <Checkbox
        control={control}
        disabled={notApplicable}
        label="Answer is required"
        name="required"
        variant="secondaryVariant"
      />
      {questionType === 'switch' && (
        <>
          <HStack {...group} alignItems="flex-start" spacing="20px">
            <Text>Compliant answer is:</Text>
            {SwitchOptions.map(({ value, label }) => {
              const radio = getRadioProps({ value });
              return (
                <CustomRadioButton key={value} {...radio} fontSize="smm">
                  {label}
                </CustomRadioButton>
              );
            })}
          </HStack>
          <Checkbox
            control={control}
            label="NA answer permitted"
            name="notApplicable"
            variant="secondaryVariant"
          />
        </>
      )}
      <Flex justifyContent="space-between" mt="15px">
        <Button
          bg="questionsSimple.form.button.primary.bg"
          color="questionsSimple.form.button.primary.font"
          disabled={
            questionAlreadyExist ||
            Object.keys(errors).length > 0 ||
            !questionName
          }
          fontSize="sm"
          fontWeight="medium"
          h="27px"
          onClick={() => {
            const question = getValues();
            addOrUpdateQuestion({ type: questionType, ...question });
            setShowQuestionForm(false);
          }}
          p="17px"
          title={questionAlreadyExist ? 'This question already exist' : ''}
        >
          Save question
        </Button>
        <Button
          bg="questionsSimple.form.button.secondary.bg"
          color="questionsSimple.form.button.secondary.font"
          fontSize="sm"
          fontWeight="medium"
          h="27px"
          onClick={() => {
            setShowQuestionForm(false);
            setIsEdit(false);
            setEditQuestionIndex(undefined);
            setEditQuestion('');
          }}
          opacity="0.5"
          p="17px"
        >
          Cancel
        </Button>
      </Flex>
    </>
  );
};

export default QuestionSimpleForm;

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
      },
    },
  },
};
