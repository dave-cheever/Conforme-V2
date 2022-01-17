import { Button } from "@chakra-ui/button";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { IQuestionFormBase } from "../../interfaces/IQuestionFormBase";
import { questionHeader } from "../../utils/helpers";
import Checkbox from '../Forms/Checkbox';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Bin, Move, PlusIcon } from "../../icons";
import { useState, useMemo, useEffect } from "react";
import { Input } from "@chakra-ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import { TextInput } from "../Forms";
import { useComplianceItemModalContext } from "../../contexts/ComplianceItemModalProvider";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { isEmpty } from "lodash";
import { IChoice, IQuestion } from "../../interfaces/IQuestion";

const defaultValues: Partial<IQuestion<IChoice[]>> = {
  name: "",
  description: "",
  required: false,
  value: [{ label: "", isCorrect: false }]
};

const QuestionMultiChoiceForm = ({
  questionType,
  editQuestionIndex,
  editableValue,
  addOrUpdateQuestion,
  setShowQuestionForm,
  setIsEdit,
  setEditQuestionIndex,
  setEditQuestion
}: IQuestionFormBase<IChoice[]>) => {
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
    defaultValues,
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [choicesIsEmpty, setChoicesIsEmpty] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string[]>([''])
  const questionName = watch('name');
  const questionAlreadyExist = (complianceItem.questions || []).findIndex(({ name }, index) => {
    if (editQuestionIndex === index && name === questionName) return false
    return name === questionName
  }) > -1;

  const { fields, append } = useFieldArray({
    control,
    name: "value"
  });
  useEffect(() => {
    if (!isEmpty(editableValue)) {
      reset({
        name: editableValue.name,
        description: editableValue.description,
        required: editableValue.required,
        value: editableValue.value
      })
      const choicesLabel = editableValue.value && editableValue.value.map(choice => choice.label);
      if (choicesLabel) setInputValue(choicesLabel);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(editableValue)])

  useMemo(() => {
    const isEmpty = (
      inputValue.map(choice => choice === '')
    ).some(value => value === true)
    setChoicesIsEmpty(isEmpty)
  }, [inputValue])

  const onSubmitInput = (index: number, value: string) => {
    if (inputValue[index] !== value) {
      const values = getValues("value") || [];
      const options = [...values];
      const option = options[index]
      option['label'] = value
      options.splice(index, 1, option)
    }
  }

  const moveOptions = (result) => {
    setIsDragging(false);
    if (!result.source || !result.destination) {
      return;
    }
    const values = getValues("value") || [];
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
    const value = getValues("value");
    if (!value) {
      return;
    }
    if (value.some(value => value.isCorrect === true)) {
      setValue('required', true);
    } else {
      setValue('required', false);
    }
    value.map(choice => choice['isCorrect'] = false);
    setValue('value', value);
    return;
  }

  const handleInputChange = (event, index) => {
    const oldValue = [...inputValue]
    oldValue.splice(index, 1, event.target.value)
    setInputValue([...oldValue])
  }

  const removeChoice = (index: number) => {
    if (fields.length === 1) {
      return;
    }
    const values = getValues("value") || [];
    const value = [...values];
    const newInputsValue = [...inputValue];
    value.splice(index, 1);
    newInputsValue.splice(index, 1);
    reset({
      ...getValues(),
      value,
    });
    setInputValue([...newInputsValue]);
  }

  return (
    <Flex flexDir="column" h="full">
      <Flex
        flexDir="column" h="full"
        overflowY="auto"
        overflowX="hidden"
        pb={isDragging ? 'calc(40px + .5rem)' : 0}
        sx={{
          '&::-webkit-scrollbar': {
            backgroundColor: 'questionMultiChoiceForm.scrollBar.bg',
            width: '2px'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'questionMultiChoiceForm.scrollBar.color',
          },
        }}>
        <Text fontWeight="bold" fontSize="smm" mb="20px">
          {questionHeader(questionType)}
        </Text>
        <TextInput
          control={control}
          name="name"
          label="Question title"
          placeholder="e.g. where is the tv?"
          validations={{
            notEmpty: true,
          }}
        />
        <TextInput
          control={control}
          name="description"
          label="Question description"
        />
        <Text fontSize="ssm" my="20px" color="questionMultiChoiceForm.text.color">
          Add as many options as you need and mark the correct answers.
          Mark the correct answers by clicking on the checkbox.
        </Text>
        <Box
          w='calc(100% + 10px)'
          pr='10px'
        >
          <DragDropContext
            onDragEnd={moveOptions}
            onDragStart={() => setIsDragging(true)}
          >
            <Droppable droppableId="multiChoiceQuestionDroppable">
              {(provided, snapshot) => (
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
                      {(provided, snapshot) => (
                        <Box>
                          <Flex
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            align="center"
                          >
                            <Box {...provided.dragHandleProps}>
                              <Move w="10px" mr="14px" ml="2px" mt="-4px" stroke="questionMultiChoiceForm.icon.moveIcon" />
                            </Box>
                            <Flex w='full'>
                              <Checkbox
                                control={control}
                                name={`value.${index}.isCorrect`}
                                variant="secondaryVariant"
                              />
                              <Input
                                onChange={(e) => {
                                  handleInputChange(e, index)
                                  setTimeout(() => onSubmitInput(index, e.target.value), 1200)
                                }}
                                onKeyDown={(e) => e.key === 'Enter' && onSubmitInput(index, object.label)}
                                px="2px"
                                value={inputValue[index]}
                                name={object.id}
                                placeholder="Option name"
                              />
                            </Flex>
                            <Bin
                              w='20px'
                              stroke="questionMultiChoiceForm.icon.iconBin"
                              cursor={fields.length === 1 ? "no-drop" : 'pointer'}
                              mr={index + 1 === fields.length ? "12px" : "28px"}
                              onClick={() => removeChoice(index)}
                            />
                            {index + 1 === fields.length &&
                              <PlusIcon
                                onClick={() => {
                                  append({
                                    label: "",
                                    isCorrect: false,
                                  })
                                  setInputValue(prevValue => [...prevValue, ""])
                                }
                                }
                                cursor="pointer"
                                stroke="questionMultiChoiceForm.icon.plusIcon"
                              />}
                          </Flex>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                </Box>)}
            </Droppable>
          </DragDropContext>
        </Box>
      </Flex>
      <Flex justifyContent="space-between" mt='51px'>
        <Button
          bg="questionMultiChoiceForm.button.secondary.bg"
          color="questionMultiChoiceForm.button.secondary.font"
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
        <Button
          bg="questionMultiChoiceForm.button.primary.bg"
          color="questionMultiChoiceForm.button.primary.font"
          fontSize="sm"
          fontWeight="medium"
          h="27px"
          p="17px"
          disabled={questionAlreadyExist || choicesIsEmpty || Object.keys(errors).length > 0 || !questionName}
          title={questionAlreadyExist ? "This question already exist" : ''}
          onClick={() => {
            addRequiredFieldAndUpdateChoiceValue()
            const values = getValues();
            addOrUpdateQuestion({ type: questionType, ...values });
            setShowQuestionForm(false);
          }}
        >
          Save question
          <ChevronRightIcon ml="5px" />
        </Button>
      </Flex>
    </Flex>
  )
}

export default QuestionMultiChoiceForm

export const questionMultiChoiceFormStyles = {
  questionMultiChoiceForm: {
    text: {
      color: "#818197"
    },
    scrollBar: {
      bg: "#E5E5E5",
      color: "#DDD",
    },
    icon: {
      plusIcon: "#818197",
      iconBin: "#818197",
      moveIcon: "#818197"
    },
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
  }
}