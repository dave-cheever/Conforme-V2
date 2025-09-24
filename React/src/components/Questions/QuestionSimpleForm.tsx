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
      <Flex data-id="000254" alignItems="center" mb="20px">
        <Text data-id="000255" fontSize="smm" fontWeight="bold">
          {questionHeader(questionType)}
        </Text>
      </Flex>
      <TextInput
        data-id="000256"
        control={control}
        label={`${capitalize(t('question'))} title`}
        name="name"
        placeholder="e.g. where is the tv?"
        validations={{
          notEmpty: true,
        }}
        variant="secondaryVariant" />
      <Textarea
        data-id="000257"
        control={control}
        label="Description"
        name="description"
        variant="secondaryVariant" />
      <Checkbox
        data-id="000258"
        control={control}
        disabled={notApplicable}
        label="Answer is required"
        name="required"
        variant="secondaryVariant" />
      {questionType === 'switch' && (
        <>
          <HStack data-id="000259" {...group} alignItems="flex-start" spacing="20px">
            <Text data-id="000260">Compliant answer is:</Text>
            {SwitchOptions.map(({ value, label }) => {
              const radio = getRadioProps({ value });
              return (
                <CustomRadioButton data-id="000261" key={value} {...radio} fontSize="smm">
                  {label}
                </CustomRadioButton>
              );
            })}
          </HStack>
          <Checkbox
            data-id="000262"
            control={control}
            label="NA answer permitted"
            name="notApplicable"
            variant="secondaryVariant" />
        </>
      )}
      <Flex data-id="000263" justifyContent="space-between" mt="15px">
        <Button
          data-id="000264"
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
          data-id="000265"
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
            data-id="000266"
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
