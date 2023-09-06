import { useEffect, useMemo, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useFieldArray, useForm } from 'react-hook-form';

import { Box, Button, Flex, Icon, Input, Text, useRadioGroup } from '@chakra-ui/react';
import { t } from 'i18next';
import { camelCase, capitalize, isEmpty } from 'lodash';

import { useTrackerItemModalContext } from '../../contexts/TrackerItemModalProvider';
import { Move, OpenMenuArrow, PlusIcon, Trashcan } from '../../icons';
import { IQuestionFormBase } from '../../interfaces/IQuestionFormBase';
import { ITrackerQuestion } from '../../interfaces/ITrackerQuestion';
import { questionHeader } from '../../utils/helpers';
import CustomRadioButton from '../CustomRadioButton';
import { TextInput } from '../Forms';

const defaultValues: Partial<ITrackerQuestion<String>> = {
  name: '',
  description: '',
  required: false,
  value: '',
  options: [{ label: '', value: '' }],
};

function QuestionSingleChoiceForm({
  questionType,
  editQuestionIndex,
  editableValue,
  addOrUpdateQuestion,
  setShowQuestionForm,
  setIsEdit,
  setEditQuestionIndex,
  setEditQuestion,
}: IQuestionFormBase<String>) {
  const { trackerItem } = useTrackerItemModalContext();
  const {
    control,
    formState: { errors },
    watch,
    getValues,
    reset,
  } = useForm({
    mode: 'all',
    defaultValues,
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [choicesIsEmpty, setChoicesIsEmpty] = useState<boolean>(true);
  const [optionIsDuplicate, setOptionIsDuplicate] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string[]>(['']);
  const [selectedRadio, setSelectedRadio] = useState<string>('');
  const questionName = watch('name');
  const questionAlreadyExist =
    (trackerItem.questions || []).findIndex(({ name }, index) => {
      if (editQuestionIndex === index && name === questionName) return false;
      return name === questionName;
    }) > -1;

  const { fields, append } = useFieldArray({
    control,
    name: 'options',
  });

  const { getRadioProps } = useRadioGroup({
    value: selectedRadio,
    onChange: setSelectedRadio,
  });

  const containsDuplicates = (array: string[]): boolean => {
    const originalArray = array.map((array) => array.replace(/\s/g, '').toLowerCase());
    const setArray = Array.from(new Set(originalArray));

    if (originalArray.length !== setArray.length) return true;
    return false;
  };

  useEffect(() => {
    if (editableValue) {
      reset({
        name: editableValue.name,
        description: editableValue.description,
        required: editableValue.required,
        value: editableValue.value,
        options: editableValue.options,
      });
      if (editableValue.requiredAnswer) setSelectedRadio(editableValue.requiredAnswer as string);
      const choicesLabel = editableValue.options && editableValue.options.map((choice) => choice.label);
      if (choicesLabel) setInputValue(choicesLabel);
    }
  }, [JSON.stringify(editableValue)]);

  useMemo(() => {
    const isEmpty = inputValue.map((choice) => choice === '').some((value) => value === true);
    setOptionIsDuplicate(containsDuplicates(inputValue));
    setChoicesIsEmpty(isEmpty);
  }, [inputValue]);

  const onSubmitInput = (index: number, value: string) => {
    if (inputValue[index] !== value) {
      const values = getValues('options') || [];
      const options = [...values];
      const option = options[index];
      option.label = value;
      option.value = camelCase(value);
      options.splice(index, 1, option);
    }
  };

  const moveOptions = (result) => {
    setIsDragging(false);
    if (!result.source || !result.destination) return;

    const values = getValues('options') || [];
    const newOptions = [...values];
    const newInputValue = [...inputValue];
    const [removed] = newOptions.splice(result.source.index, 1);
    const [inputRemoved] = newInputValue.splice(result.source.index, 1);
    newOptions.splice(result.destination.index, 0, removed);
    newInputValue.splice(result.destination.index, 0, inputRemoved);
    reset({
      ...getValues(),
      options: newOptions,
    });
    setInputValue([...newInputValue]);
  };

  const handleInputChange = (event, index) => {
    const oldValue = [...inputValue];
    oldValue.splice(index, 1, event.target.value);
    setInputValue([...oldValue]);
  };

  const removeChoice = (index: number) => {
    if (fields.length === 1) return;

    const values = getValues('options') || [];
    const options = [...values];
    const newInputsValue = [...inputValue];
    options.splice(index, 1);
    newInputsValue.splice(index, 1);
    reset({
      ...getValues(),
      options,
    });
    setInputValue([...newInputsValue]);
  };

  return (
    (<Flex data-id="c60cec58890e" flexDir="column" h="full">
      <Flex
        data-id="7e9e3ec3db89"
        flexDir="column"
        h="full"
        overflowX="hidden"
        overflowY="auto"
        pb={isDragging ? 'calc(40px + .5rem)' : 0}
        sx={{
          '&::-webkit-scrollbar': {
            backgroundColor: 'questionSingleChoiceForm.scrollBar.bg',
            width: '2px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'questionSingleChoiceForm.scrollBar.color',
          },
        }}>
        <Text data-id="2557e73b1059" fontSize="smm" fontWeight="bold" mb="20px">
          {questionHeader(questionType)}
        </Text>
        <TextInput
          control={control}
          data-id="35ad5e0350ab"
          label={`${capitalize(t('question'))} title`}
          name="name"
          placeholder="e.g. where is the tv?"
          validations={{
            notEmpty: true,
          }} />
        <TextInput
          control={control}
          data-id="d692ab145cd6"
          label="Description"
          name="description" />
        <Text
          color="questionSingleChoiceForm.text.color"
          data-id="b3dfa5afa99e"
          fontSize="ssm"
          my="20px">
          Add as many options as you need and mark the correct answers. Mark the correct answers by clicking on the checkbox.
        </Text>
        <Box data-id="8939e0c0aade" pr="10px" w="calc(100% + 10px)">
          <DragDropContext
            data-id="65fb3a027d69"
            onDragEnd={moveOptions}
            onDragStart={() => setIsDragging(true)}>
            <Droppable data-id="f6035cda2965" droppableId="multiChoiceQuestionDroppable">
              {(provided) => (
                <Box
                  data-id="dc36b9cb76cf"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  width="full">
                  {fields.map(({ id, label, value }, index) => {
                    const radio = getRadioProps({ ...(value ? { value } : { value: JSON.stringify(index) }) });
                    return (
                      (<Draggable data-id="be1ac919f283" draggableId={id} index={index} key={id}>
                        {(provided) => (
                          <Box data-id="a8e81416c76a">
                            <Flex
                              data-id="50d9fa2dfc4c"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              align="center">
                              <Box data-id="3c21ca1a7e1d" {...provided.dragHandleProps}>
                                <Move
                                  data-id="74266936e08d"
                                  ml="2px"
                                  mr="14px"
                                  mt="-4px"
                                  stroke="questionSingleChoiceForm.icon.moveIcon"
                                  w="10px" />
                              </Box>
                              <Flex data-id="7118e6b06dbe" w="full">
                                <CustomRadioButton data-id="dac7d9ae5053" {...radio} fontSize="smm" isSingleChoice>
                                  <Input
                                    data-id="222b094b681b"
                                    name={id}
                                    onBlur={() => reset({ ...getValues() })}
                                    onChange={(e) => {
                                      handleInputChange(e, index);
                                      setTimeout(() => onSubmitInput(index, e.target.value), 1000);
                                    }}
                                    onKeyDown={(e) => e.key === 'Enter' && onSubmitInput(index, label)}
                                    placeholder="Option name"
                                    px="2px"
                                    value={inputValue[index]} />
                                </CustomRadioButton>
                              </Flex>
                              <Trashcan
                                cursor={fields.length === 1 ? 'no-drop' : 'pointer'}
                                data-id="13984b7845ee"
                                mr={index + 1 === fields.length ? '12px' : '28px'}
                                onClick={() => removeChoice(index)}
                                stroke="questionSingleChoiceForm.icon.iconBin"
                                w="20px" />
                              {index + 1 === fields.length && (
                                <PlusIcon
                                  cursor="pointer"
                                  data-id="5e77feb3506d"
                                  onClick={() => {
                                    append({
                                      label: '',
                                      value: '',
                                    });
                                    setInputValue((prevValue) => [...prevValue, '']);
                                  }}
                                  stroke="questionSingleChoiceForm.icon.plusIcon" />
                              )}
                            </Flex>
                          </Box>
                        )}
                      </Draggable>)
                    );
                  })}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
        </Box>
      </Flex>
      {optionIsDuplicate && (
        <Text
          color="questionSingleChoiceForm.text.error"
          data-id="ef874554c31f"
          fontSize="sm">
          Options cannot be duplicated
        </Text>
      )}
      <Flex data-id="590593cb10a6" justifyContent="space-between" mt="51px">
        <Button
          bg="questionSingleChoiceForm.button.secondary.bg"
          color="questionSingleChoiceForm.button.secondary.font"
          data-id="0703fa9767d4"
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
          bg="questionSingleChoiceForm.button.primary.bg"
          color="questionSingleChoiceForm.button.primary.font"
          data-id="fe65f03bfaae"
          disabled={questionAlreadyExist || choicesIsEmpty || Object.keys(errors).length > 0 || !questionName || optionIsDuplicate}
          fontSize="sm"
          fontWeight="medium"
          h="27px"
          onClick={() => {
            const values = getValues();
            addOrUpdateQuestion({
              type: questionType,
              ...values,
              ...(!isEmpty(selectedRadio) && { requiredAnswer: selectedRadio, required: true }),
            });
            setShowQuestionForm(false);
          }}
          p="17px"
          rightIcon={<Icon
            as={OpenMenuArrow}
            data-id="899c84285374"
            stroke="trackerItemModal.tabs.bottomButton.icon"
            transform="rotate(270deg)" />}
          title={questionAlreadyExist ? 'This question already exist' : ''}>
          Save question
        </Button>
      </Flex>
    </Flex>)
  );
}

export default QuestionSingleChoiceForm;

export const questionSingleChoiceFormStyles = {
  questionSingleChoiceForm: {
    text: {
      color: '#818197',
      error: '#E53E3E',
    },
    scrollBar: {
      bg: '#E5E5E5',
      color: '#DDD',
    },
    icon: {
      plusIcon: '#818197',
      iconBin: '#818197',
      moveIcon: '#818197',
    },
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
};
