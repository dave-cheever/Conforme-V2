import { useEffect, useMemo, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useFieldArray, useForm } from 'react-hook-form';

import { Box, Button, Flex, Icon, Input, Text } from '@chakra-ui/react';
import { isEmpty } from 'lodash';

import { useComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';
import { Move, OpenMenuArrow, PlusIcon, Trashcan } from '../../icons';
import { IQuestionChoice } from '../../interfaces/IQuestionChoice';
import { IQuestionFormBase } from '../../interfaces/IQuestionFormBase';
import { ITrackerQuestion } from '../../interfaces/ITrackerQuestion';
import { questionHeader } from '../../utils/helpers';
import { TextInput } from '../Forms';
import Checkbox from '../Forms/Checkbox';

const defaultValues: Partial<ITrackerQuestion<IQuestionChoice[]>> = {
  name: '',
  description: '',
  required: false,
  value: [{ label: '', isCorrect: false }],
};

const QuestionMultiChoiceForm = ({
  questionType,
  editQuestionIndex,
  editableValue,
  addOrUpdateQuestion,
  setShowQuestionForm,
  setIsEdit,
  setEditQuestionIndex,
  setEditQuestion,
}: IQuestionFormBase<IQuestionChoice[]>) => {
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
    defaultValues,
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [choicesIsEmpty, setChoicesIsEmpty] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string[]>(['']);
  const questionName = watch('name');
  const questionAlreadyExist =
    (complianceItem.questions || []).findIndex(({ name }, index) => {
      if (editQuestionIndex === index && name === questionName) return false;
      return name === questionName;
    }) > -1;

  const { fields, append } = useFieldArray({
    control,
    name: 'value',
  });
  useEffect(() => {
    if (!isEmpty(editableValue)) {
      reset({
        name: editableValue.name,
        description: editableValue.description,
        required: editableValue.required,
        value: editableValue.value,
      });
      const choicesLabel =
        editableValue.value &&
        editableValue.value.map((choice) => choice.label);
      if (choicesLabel) setInputValue(choicesLabel);
    }
  }, [JSON.stringify(editableValue)]);

  useMemo(() => {
    const isEmpty = inputValue
      .map((choice) => choice === '')
      .some((value) => value === true);
    setChoicesIsEmpty(isEmpty);
  }, [inputValue]);

  const onSubmitInput = (index: number, value: string) => {
    if (inputValue[index] !== value) {
      const values = getValues('value') || [];
      const options = [...values];
      const option = options[index];
      option.label = value;
      options.splice(index, 1, option);
    }
  };

  const moveOptions = (result) => {
    setIsDragging(false);
    if (!result.source || !result.destination) return;

    const values = getValues('value') || [];
    const newOptions = [...values];
    const newInputValue = [...inputValue];
    const [removed] = newOptions.splice(result.source.index, 1);
    const [inputRemoved] = newInputValue.splice(result.source.index, 1);
    newOptions.splice(result.destination.index, 0, removed);
    newInputValue.splice(result.destination.index, 0, inputRemoved);
    reset({
      ...getValues(),
      value: newOptions,
    });
    setInputValue([...newInputValue]);
  };

  const addRequiredFieldAndUpdateChoiceValue = () => {
    const value = getValues('value');
    if (!value) return;

    if (value.some((value) => value.isCorrect === true))
      setValue('required', true);
    else setValue('required', false);

    value.forEach((choice) => {
      // eslint-disable-next-line no-param-reassign
      choice.isCorrect = false;
    });
    setValue('value', value);
  };

  const handleInputChange = (event, index) => {
    const oldValue = [...inputValue];
    oldValue.splice(index, 1, event.target.value);
    setInputValue([...oldValue]);
  };

  const removeChoice = (index: number) => {
    if (fields.length === 1) return;

    const values = getValues('value') || [];
    const value = [...values];
    const newInputsValue = [...inputValue];
    value.splice(index, 1);
    newInputsValue.splice(index, 1);
    reset({
      ...getValues(),
      value,
    });
    setInputValue([...newInputsValue]);
  };

  return (
    <Flex flexDir="column" h="full">
      <Flex
        flexDir="column"
        h="full"
        overflowX="hidden"
        overflowY="auto"
        pb={isDragging ? 'calc(40px + .5rem)' : 0}
        sx={{
          '&::-webkit-scrollbar': {
            backgroundColor: 'questionMultiChoiceForm.scrollBar.bg',
            width: '2px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'questionMultiChoiceForm.scrollBar.color',
          },
        }}
      >
        <Text fontSize="smm" fontWeight="bold" mb="20px">
          {questionHeader(questionType)}
        </Text>
        <TextInput
          control={control}
          label="Question title"
          name="name"
          placeholder="e.g. where is the tv?"
          validations={{
            notEmpty: true,
          }}
        />
        <TextInput
          control={control}
          label="Question description"
          name="description"
        />
        <Text
          color="questionMultiChoiceForm.text.color"
          fontSize="ssm"
          my="20px"
        >
          Add as many options as you need and mark the correct answers. Mark the
          correct answers by clicking on the checkbox.
        </Text>
        <Box pr="10px" w="calc(100% + 10px)">
          <DragDropContext
            onDragEnd={moveOptions}
            onDragStart={() => setIsDragging(true)}
          >
            <Droppable droppableId="multiChoiceQuestionDroppable">
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  width="full"
                >
                  {fields.map((object, index) => (
                    <Draggable
                      draggableId={object.id}
                      index={index}
                      key={object.id}
                    >
                      {(provided) => (
                        <Box>
                          <Flex
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            align="center"
                          >
                            <Box {...provided.dragHandleProps}>
                              <Move
                                ml="2px"
                                mr="14px"
                                mt="-4px"
                                stroke="questionMultiChoiceForm.icon.moveIcon"
                                w="10px"
                              />
                            </Box>
                            <Flex w="full">
                              <Checkbox
                                control={control}
                                name={`value.${index}.isCorrect`}
                                variant="secondaryVariant"
                              />
                              <Input
                                name={object.id}
                                onChange={(e) => {
                                  handleInputChange(e, index);
                                  setTimeout(
                                    () => onSubmitInput(index, e.target.value),
                                    1200,
                                  );
                                }}
                                onKeyDown={(e) =>
                                  e.key === 'Enter' &&
                                  onSubmitInput(index, object.label)
                                }
                                placeholder="Option name"
                                px="2px"
                                value={inputValue[index]}
                              />
                            </Flex>
                            <Trashcan
                              cursor={
                                fields.length === 1 ? 'no-drop' : 'pointer'
                              }
                              mr={index + 1 === fields.length ? '12px' : '28px'}
                              onClick={() => removeChoice(index)}
                              stroke="questionMultiChoiceForm.icon.iconBin"
                              w="20px"
                            />
                            {index + 1 === fields.length && (
                              <PlusIcon
                                cursor="pointer"
                                onClick={() => {
                                  append({
                                    label: '',
                                    isCorrect: false,
                                  });
                                  setInputValue((prevValue) => [
                                    ...prevValue,
                                    '',
                                  ]);
                                }}
                                stroke="questionMultiChoiceForm.icon.plusIcon"
                              />
                            )}
                          </Flex>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
        </Box>
      </Flex>
      <Flex justifyContent="space-between" mt="51px">
        <Button
          bg="questionMultiChoiceForm.button.secondary.bg"
          color="questionMultiChoiceForm.button.secondary.font"
          fontSize="sm"
          fontWeight="700"
          h="27px"
          onClick={() => {
            setShowQuestionForm(false);
            setIsEdit(false);
            setEditQuestionIndex(undefined);
            setEditQuestion('');
          }}
          p="17px"
        >
          Cancel
        </Button>
        <Button
          bg="questionMultiChoiceForm.button.primary.bg"
          color="questionMultiChoiceForm.button.primary.font"
          disabled={
            questionAlreadyExist ||
            choicesIsEmpty ||
            Object.keys(errors).length > 0 ||
            !questionName
          }
          fontSize="sm"
          fontWeight="medium"
          h="27px"
          onClick={() => {
            addRequiredFieldAndUpdateChoiceValue();
            const values = getValues();
            addOrUpdateQuestion({ type: questionType, ...values });
            setShowQuestionForm(false);
          }}
          p="17px"
          rightIcon={
            <Icon
              as={OpenMenuArrow}
              stroke="complianceItemModal.tabs.bottomButton.icon"
              transform="rotate(270deg)"
            />
          }
          title={questionAlreadyExist ? 'This question already exist' : ''}
        >
          Save question
        </Button>
      </Flex>
    </Flex>
  );
};

export default QuestionMultiChoiceForm;

export const questionMultiChoiceFormStyles = {
  questionMultiChoiceForm: {
    text: {
      color: '#818197',
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
