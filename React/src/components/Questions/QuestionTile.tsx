import React from 'react';

import { Button, Flex } from '@chakra-ui/react';

import QuestionIcon from './QuestionIcon';

function QuestionTile({ setQuestionType, type, buttonText, setShowQuestionForm, disabled }) {
  return (
    <Flex
      data-id="000311"
      alignItems="center"
      bg="adminTrackerItemModal.section.questions.tile.bg"
      borderRadius="10px"
      flexDir="column"
      p="15px 30px"
      w="full">
      <QuestionIcon
        data-id="000312"
        color="adminTrackerItemModal.section.questions.tile.icon"
        h="50px"
        m="30px 0"
        type={type}
        w="50px" />
      <Button
        data-id="000313"
        bg="adminTrackerItemModal.section.questions.tile.button.bg"
        color="adminTrackerItemModal.section.questions.tile.button.font"
        disabled={disabled}
        fontWeight="semi_medium"
        onClick={() => {
          setQuestionType(type);
          setShowQuestionForm(true);
        }}>
        {buttonText}
      </Button>
    </Flex>
  );
}

export default QuestionTile;
