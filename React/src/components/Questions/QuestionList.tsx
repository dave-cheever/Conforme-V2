import React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import { Box, Flex, Stack } from '@chakra-ui/react';

import { Move } from '../../icons';
import QuestionListElement from './QuestionListElement';

function QuestionList({ setIsDragging, trackerItem, disabled, handleChange, handleEdit }) {
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
    <Stack data-id="000244" overflowY="auto">
      <DragDropContext
        data-id="000245"
        onDragEnd={moveQuestion}
        onDragStart={() => setIsDragging(true)}>
        <Droppable data-id="000246" droppableId="questionsDroppable">
          {(provided) => (
            <Box
              data-id="000247"
              ref={provided.innerRef}
              {...provided.droppableProps}
              width="full">
              {trackerItem.questions?.map((item, index) => (
                <Draggable
                  data-id="000248"
                  draggableId={item.name}
                  index={index}
                  key={item.name}>
                  {(provided) => (
                    <Box data-id="000249" m={2}>
                      <Flex
                        data-id="000250"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        align="center"
                        bg="questionList.bg"
                        rounded="10px">
                        <Box
                          data-id="000251"
                          {...provided.dragHandleProps}
                          mr={disabled ? '20px' : '10px'}>
                          {!disabled && <Move
                            data-id="000252"
                            ml="15px"
                            mt="-4px"
                            stroke="questionList.icon"
                            w="10px" />}
                        </Box>
                        <QuestionListElement
                          data-id="000253"
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
    </Stack>
  );
}

export default QuestionList;

export const questionListStyles = {
  questionList: {
    bg: '#FFFFFF',
    icon: '#818197',
  },
};
