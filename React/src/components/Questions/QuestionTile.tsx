import React from 'react';

import { Button, Flex } from '@chakra-ui/react';

import QuestionIcon from './QuestionIcon';

function QuestionTile({ setQuestionType, type, buttonText, setShowQuestionForm, disabled }) {
  return <Flex
    alignItems="center"
    bg="adminTrackerItemModal.section.questions.tile.bg"
    borderRadius="10px"
    data-id="f7aff7aabe94"
    flexDir="column"
    p="15px 30px"
    w="full">
    <QuestionIcon
      color="adminTrackerItemModal.section.questions.tile.icon"
      data-id="d50feee6beb5"
      h="50px"
      m="30px 0"
      type={type}
      w="50px" />
    <Button
      bg="adminTrackerItemModal.section.questions.tile.button.bg"
      color="adminTrackerItemModal.section.questions.tile.button.font"
      data-id="1744edaff96a"
      disabled={disabled}
      fontWeight="semi_medium"
      onClick={() => {
        setQuestionType(type);
        setShowQuestionForm(true);
      }}>
      {buttonText}
    </Button>
  </Flex>
}

export default QuestionTile;
