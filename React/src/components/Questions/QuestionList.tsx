import React from 'react';
import { Box, Flex, Stack } from '@chakra-ui/react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import QuestionListElement from './QuestionListElement';
import {
  Move
} from '../../icons';

const QuestionList = ({ setIsDragging, complianceItem, disabled, handleChange, handleEdit }) => {
  const moveQuestion = (result) => {
    setIsDragging(false);
    if (!result.source || !result.destination) {
      return;
    }
    const questions = [...complianceItem.questions];
    const [removed] = questions.splice(result.source.index, 1);
    questions.splice(result.destination.index, 0, removed);
    handleChange(questions);
  };

  const removeQuestion = (index: number) => {
    const questions = [...complianceItem.questions];
    questions.splice(index, 1);
    handleChange(questions);
  };

  return (
    <Stack overflowY="auto">
      <DragDropContext
        onDragEnd={moveQuestion}
        onDragStart={() => setIsDragging(true)}
      >
        <Droppable droppableId="questionsDroppable">
          {(provided, snapshot) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              width="full"
            >
              {complianceItem.questions?.map((item, index) => (
                <Draggable
                  draggableId={item.name}
                  index={index}
                  key={item.name}
                >
                  {(provided, snapshot) => (
                    <Box m={2}>
                      <Flex
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        align="center"
                        bg="questionList.bg"
                        rounded="10px"
                      >
                        <Box {...provided.dragHandleProps} mr={disabled ? "20px" : "10px"}>
                          {!disabled &&
                            <Move w="10px" ml="15px" mt="-4px" stroke="questionList.icon" />
                          }
                        </Box>
                        <QuestionListElement
                          question={item}
                          removeQuestion={disabled ? undefined : () => removeQuestion(index)}
                          editQuestion={() => handleEdit(index, item)}
                        />
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
};

export default QuestionList;

export const questionListStyles = {
  questionList: {
    bg: "#FFFFFF",
    icon: "#818197"
  }
};
