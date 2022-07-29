import React from 'react';

import { Button, Flex } from '@chakra-ui/react';

import QuestionIcon from './QuestionIcon';

const QuestionTile = ({ setQuestionType, type, buttonText, setShowQuestionForm, disabled }) => (
  <Flex
    alignItems="center"
    bg="adminComplianceItemModal.section.questions.tile.bg"
    borderRadius="10px"
    flexDir="column"
    p="15px 30px"
    w="full"
  >
    <QuestionIcon color="adminComplianceItemModal.section.questions.tile.icon" h="50px" m="30px 0" type={type} w="50px" />
    <Button
      bg="adminComplianceItemModal.section.questions.tile.button.bg"
      color="adminComplianceItemModal.section.questions.tile.button.font"
      disabled={disabled}
      fontWeight="semi_medium"
      onClick={() => {
        setQuestionType(type);
        setShowQuestionForm(true);
      }}
    >
      {buttonText}
    </Button>
  </Flex>
);

export default QuestionTile;
