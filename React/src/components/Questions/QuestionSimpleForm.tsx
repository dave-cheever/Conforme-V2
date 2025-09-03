import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button, Flex, HStack, Icon, Text, useRadioGroup } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize, isEmpty } from 'lodash';

import { SwitchOptions } from '../../bootstrap/config';
import { useTrackerItemModalContext } from '../../contexts/TrackerItemModalProvider';
import { OpenMenuArrow } from '../../icons';
import { IQuestionFormBase } from '../../interfaces/IQuestionFormBase';
import { questionHeader } from '../../utils/helpers';
import CustomRadioButton from '../CustomRadioButton';
import Checkbox from '../Forms/Checkbox';
import Textarea from '../Forms/Textarea';
import TextInput from '../Forms/TextInput';

function QuestionSimpleForm({
  questionType,
  editQuestionIndex,
  editableValue,
  addOrUpdateQuestion,
  setShowQuestionForm,
  setIsEdit,
  setEditQuestionIndex,
  setEditQuestion,
}: IQuestionFormBase<string>) {
  const { trackerItem } = useTrackerItemModalContext();
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

  const [questionName, required, notApplicable] = watch(['name', 'required', 'notApplicable']);
  const [selectedRadio, setSelectedRadio] = useState<string>('');

  const questionAlreadyExist =
    (trackerItem.questions || []).findIndex(({ name }, index) => {
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
        name: editableValue.name || '',
        description: editableValue.description || '',
        required: editableValue.required || false,
        requiredAnswer: (editableValue.requiredAnswer as string) || '',
        notApplicable: editableValue.notApplicable,
      });
      setSelectedRadio((editableValue.requiredAnswer as string) || '');
    }
  }, [JSON.stringify(editableValue)]);

  useEffect(() => {
    if (!questionName) return;

    if (required === false || notApplicable) setSelectedRadio('');
  }, [required, questionName, notApplicable]);

  const group = getRootProps();

  return (
    <>
      <Flex data-id="030925-85b3aa" alignItems="center" mb="20px">
        <Text data-id="030925-411407" fontSize="smm" fontWeight="bold">
          {questionHeader(questionType)}
        </Text>
      </Flex>
      <TextInput
        data-id="030925-8f6fd5"
        control={control}
        label={`${capitalize(t('question'))} title`}
        name="name"
        placeholder="e.g. where is the tv?"
        validations={{
          notEmpty: true,
        }}
        variant="secondaryVariant" />
      <Textarea
        data-id="030925-7253a2"
        control={control}
        label="Description"
        name="description"
        variant="secondaryVariant" />
      <Checkbox
        data-id="030925-c87389"
        control={control}
        disabled={notApplicable}
        label="Answer is required"
        name="required"
        variant="secondaryVariant" />
      {questionType === 'switch' && (
        <>
          <HStack data-id="030925-894fc4" {...group} alignItems="flex-start" spacing="20px">
            <Text data-id="030925-94ba32">Compliant answer is:</Text>
            {SwitchOptions.map(({ value, label }) => {
              const radio = getRadioProps({ value });
              return (
                <CustomRadioButton data-id="030925-b7c5fb" key={value} {...radio} fontSize="smm">
                  {label}
                </CustomRadioButton>
              );
            })}
          </HStack>
          <Checkbox
            data-id="030925-cd92da"
            control={control}
            label="NA answer permitted"
            name="notApplicable"
            variant="secondaryVariant" />
        </>
      )}
      <Flex data-id="030925-7e18ef" justifyContent="space-between" mt="15px">
        <Button
          data-id="030925-87fc4e"
          bg="questionsSimple.form.button.secondary.bg"
          color="questionsSimple.form.button.secondary.font"
          fontSize="sm"
          fontWeight="700"
          h="27px"
          onClick={() => {
            setShowQuestionForm(false);
            setIsEdit(false);
            setEditQuestionIndex(undefined);
            setEditQuestion('');
          }}
          p="17px">
          Cancel
        </Button>
        <Button
          data-id="030925-a96fdf"
          bg="questionsSimple.form.button.primary.bg"
          color="questionsSimple.form.button.primary.font"
          disabled={questionAlreadyExist || Object.keys(errors).length > 0 || !questionName}
          fontSize="sm"
          fontWeight="medium"
          h="27px"
          onClick={() => {
            const question = getValues();
            addOrUpdateQuestion({ type: questionType, ...question });
            setShowQuestionForm(false);
          }}
          p="17px"
          rightIcon={<Icon
            data-id="030925-34a9a0"
            as={OpenMenuArrow}
            stroke="trackerItemModal.tabs.bottomButton.icon"
            transform="rotate(270deg)" />}
          title={questionAlreadyExist ? 'This question already exist' : ''}>
          Save question
        </Button>
      </Flex>
    </>
  );
}

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
          bg: '#F0F2F5',
          font: '#818197',
        },
      },
    },
  },
};
