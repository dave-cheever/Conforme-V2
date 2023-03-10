import React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import { Box, Flex, Stack } from '@chakra-ui/react';

import { Move } from '../../icons';
import QuestionListElement from './QuestionListElement';

const QuestionList = ({ setIsDragging, trackerItem, disabled, handleChange, handleEdit }) => {
  const moveQuestion = (result) => {
    setIsDragging(false);
    if (!result.source || !result.destination) return;

    const questions = [...trackerItem.questions];
    const [removed] = questions.splice(result.source.index, 1);
    questions.splice(result.destination.index, 0, removed);
    handleChange(questions);
  };

  const removeQuestion = (index: number) => {
    const questions = [...trackerItem.questions];
    questions.splice(index, 1);
    handleChange(questions);
  };

  return (
    (<Stack data-id="b6dea74f6a5d" overflowY="auto">
      <DragDropContext
        data-id="eca688222456"
        onDragEnd={moveQuestion}
        onDragStart={() => setIsDragging(true)}>
        <Droppable data-id="894b813bce11" droppableId="questionsDroppable">
          {(provided) => (
            <Box
              data-id="fb363a0f1ff9"
              ref={provided.innerRef}
              {...provided.droppableProps}
              width="full">
              {trackerItem.questions?.map((item, index) => (
                <Draggable
                  data-id="22caa68a613b"
                  draggableId={item.name}
                  index={index}
                  key={item.name}>
                  {(provided) => (
                    <Box data-id="c533d9dd1a4d" m={2}>
                      <Flex
                        data-id="59c1c2c2a3fe"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        align="center"
                        bg="questionList.bg"
                        rounded="10px">
                        <Box
                          data-id="905dd2a693b9"
                          {...provided.dragHandleProps}
                          mr={disabled ? '20px' : '10px'}>
                          {!disabled && <Move
                            data-id="02dfd3efdd81"
                            ml="15px"
                            mt="-4px"
                            stroke="questionList.icon"
                            w="10px" />}
                        </Box>
                        <QuestionListElement
                          data-id="f00f3f2921e7"
                          editQuestion={() => handleEdit(index, item)}
                          question={item}
                          removeQuestion={disabled ? undefined : () => removeQuestion(index)} />
                      </Flex>
                    </Box>
                  )}
                </Draggable>
              ))}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Stack>)
  );
};

export default QuestionList;

export const questionListStyles = {
  questionList: {
    bg: '#FFFFFF',
    icon: '#818197',
  },
};
