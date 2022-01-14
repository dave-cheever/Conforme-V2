import React from "react";
import { Box, Flex, Stack, Text } from "@chakra-ui/react";

import { IQuestion } from "../../interfaces/IQuestion";
import { AsteriskQuestion, Bin } from "../../icons";
import { questionHeader } from "../../utils/helpers";

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
      bg={bgColor ? bgColor : 'questionListElement.bg'}
      rounded='10px'
      borderWidth='2px'
      borderColor='questionListElement.border'
    >
      <Flex w="calc(100% - 40px)" flexDir="column">
        <Text fontSize="11px" color="questionListElement.label">{questionHeader(question.type)}</Text>
        <Flex flexGrow={1} maxW='calc(100% - 60px - 2rem)' alignItems="center">
          <Box
            color='questionListElement.name'
            fontSize='smm'
            fontWeight="bold"
            overflow='hidden'
            textOverflow='ellipsis'
            whiteSpace='nowrap'
          >{question.name}</Box>
           {question.required && <AsteriskQuestion ml="5px" fill='questionListElement.iconAsterisk' stroke='questionListElement.iconAsterisk' w="12px" h="12px" />}
        </Flex>
      </Flex>
      {removeQuestion && 
        <Bin 
          w='20px' 
          stroke="questionListElement.iconBin" 
          cursor='pointer' 
          onClick={removeQuestion} 
        />}
    </Stack>
  );
}

export default QuestionListElement;

export const questionListElementStyles = {
  questionListElement: {
    bg: "#FFFFFF",
    border: "#FFFFFF",
    name: "#2B3236",
    label: "#818197",
    iconAsterisk: "#E93C44",
    iconBin: "#818197"
  }
};
