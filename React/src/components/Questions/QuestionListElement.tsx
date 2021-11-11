import React from "react";
import { Box, Flex, Stack } from "@chakra-ui/react";

import { IQuestion } from "../../interfaces/IQuestion";
import { Bin, Asterisk } from "../../icons";
import QuestionIcon from './QuestionIcon';

interface IQuestionListElement {
  question: IQuestion;
  bgColor?: string;
  removeQuestion?: () => void;
}
const QuestionListElement = ({ question, bgColor, removeQuestion }: IQuestionListElement) => {

  return (
    <Stack
      w='calc(100% - 2rem)'
      h='65px'
      direction='row'
      spacing={4}
      px={4}
      align='center'
      bg={bgColor ? bgColor : 'adminComplianceItemModal.section.questions.list.element.bg'}
      rounded='10px'
      borderWidth='2px'
      borderColor='white'
    >
      <QuestionIcon w='36px' h='27px' color='adminComplianceItemModal.section.questions.list.element.icon' type={question.type} />
      <Flex direction='column' flexGrow={1} maxW='calc(100% - 60px - 2rem)'>
        <Box
          color='adminComplianceItemModal.section.questions.list.element.name'
          fontSize='md'
          overflow='hidden'
          textOverflow='ellipsis'
          whiteSpace='nowrap'
        >{question.name}</Box>
        {question.description && <Box
          color='adminComplianceItemModal.section.questions.list.element.description'
          fontSize='14px'
          overflow='hidden'
          textOverflow='ellipsis'
          whiteSpace='nowrap'
        >{question.description}</Box>}
      </Flex>
      <Box w={1} >
        {question.required && <Asterisk stroke='adminComplianceItemModal.section.questions.list.element.asterisk' w='9px' h='9px' mt='-4px' />}
      </Box>
      {removeQuestion && <Bin w='20px' cursor='pointer' onClick={removeQuestion} color='adminComplianceItemModal.section.questions.list.element.remove' />}
    </Stack>
  );
}

export default QuestionListElement;
