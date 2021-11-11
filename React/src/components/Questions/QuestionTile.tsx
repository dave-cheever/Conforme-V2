import React from 'react';
import { Button, Flex } from '@chakra-ui/react';

import QuestionIcon from './QuestionIcon';

const QuestionTile = ({
  setQuestionType,
  type,
  buttonText,
  setShowQuestionForm,
  disabled
}) => {
  return (
    <Flex
      w="full"
      bg="adminComplianceItemModal.section.questions.tile.bg"
      p="15px 30px"
      flexDir="column"
      borderRadius="10px"
      alignItems="center"
    >
      <QuestionIcon type={type} w='50px' h='50px' color='adminComplianceItemModal.section.questions.tile.icon' m='30px 0'/>
      <Button
        color="adminComplianceItemModal.section.questions.tile.button.font"
        bg="adminComplianceItemModal.section.questions.tile.button.bg"
        fontWeight="semi_medium"
        onClick={() => {
          setQuestionType(type);
          setShowQuestionForm(true);
        }}
        disabled={disabled}
      >
        {buttonText}
      </Button>
    </Flex>
  );
};

export default QuestionTile;
