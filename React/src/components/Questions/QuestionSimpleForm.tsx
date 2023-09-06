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

  return (<>
    <Flex alignItems="center" data-id="709af2b2efa8" mb="20px">
      <Text data-id="da82a7d521c8" fontSize="smm" fontWeight="bold">
        {questionHeader(questionType)}
      </Text>
    </Flex>
    <TextInput
      control={control}
      data-id="c91e85f4ba77"
      label={`${capitalize(t('question'))} title`}
      name="name"
      placeholder="e.g. where is the tv?"
      validations={{
        notEmpty: true,
      }}
      variant="secondaryVariant" />
    <Textarea
      control={control}
      data-id="76a5de3af0b7"
      label="Description"
      name="description"
      variant="secondaryVariant" />
    <Checkbox
      control={control}
      data-id="d495b68e7c2c"
      disabled={notApplicable}
      label="Answer is required"
      name="required"
      variant="secondaryVariant" />
    {questionType === 'switch' && (
      <>
        <HStack data-id="573331c847aa" {...group} alignItems="flex-start" spacing="20px">
          <Text data-id="c46db59f0031">Compliant answer is:</Text>
          {SwitchOptions.map(({ value, label }) => {
            const radio = getRadioProps({ value });
            return (
              (<CustomRadioButton data-id="a730ec9febb6" key={value} {...radio} fontSize="smm">
                {label}
              </CustomRadioButton>)
            );
          })}
        </HStack>
        <Checkbox
          control={control}
          data-id="363dde0fab55"
          label="NA answer permitted"
          name="notApplicable"
          variant="secondaryVariant" />
      </>
    )}
    <Flex data-id="0aa9f298c349" justifyContent="space-between" mt="15px">
      <Button
        bg="questionsSimple.form.button.secondary.bg"
        color="questionsSimple.form.button.secondary.font"
        data-id="21449055cff0"
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
        bg="questionsSimple.form.button.primary.bg"
        color="questionsSimple.form.button.primary.font"
        data-id="63a0f1f30ae0"
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
          as={OpenMenuArrow}
          data-id="eccab343c6cc"
          stroke="trackerItemModal.tabs.bottomButton.icon"
          transform="rotate(270deg)" />}
        title={questionAlreadyExist ? 'This question already exist' : ''}>
        Save question
      </Button>
    </Flex>
  </>);
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
