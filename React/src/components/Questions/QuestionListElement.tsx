import React, { useRef, useEffect, useState } from "react";
import { Flex, Stack, Text, Tooltip } from "@chakra-ui/react";

import { ITrackerQuestion } from "../../interfaces/ITrackerQuestion";
import { Asterisk, Bin, EditIcon }  from "../../icons";
import { questionHeader } from "../../utils/helpers";
import { TQuestionValue } from "../../interfaces/TQuestionValue";

interface IQuestionListElement {
  question: ITrackerQuestion<TQuestionValue>;
  bgColor?: string;
  removeQuestion?: () => void;
  editQuestion?: () => void;
}
const QuestionListElement = ({ question, bgColor, removeQuestion, editQuestion }: IQuestionListElement) => {

  const ref: any = useRef(null);
  const [isTextOverflown, setIsTextOverflown] = useState(false);

  useEffect(() => {
    const element = ref.current!;
    if (element) {
      //only show tooltip if text overflow is happening.
      setIsTextOverflown(element.scrollHeight > element.clientHeight);
    }
  }, []);

  return (
    <Stack
      w='calc(100% - 1rem)'
      minH='65px'
      direction='row'
      spacing={2}
      px={4}
      align='center'
      bg={bgColor ? bgColor : 'questionListElement.bg'}
      rounded='10px'
      borderWidth='2px'
      borderColor='questionListElement.border'
    >
      <Flex w="calc(100% - 40px)" flexDir="column">
        <Text fontSize="11px" color="questionListElement.label">{questionHeader(question.type)}</Text>
        <Flex flexGrow={1} w="full" alignItems="center">
          <Tooltip hasArrow label={question.name} isDisabled={!isTextOverflown} bg="questionListElement.tooltipBg" color="questionListElement.tooltipColor" placement="top">
            <Text
              color='questionListElement.name'
              fontSize='smm'
              fontWeight="bold"
              noOfLines={4}
              ref={ref}
            >{question.name}</Text>
          </Tooltip>
          {question.required && <Asterisk ml="5px" mb="8px" fill="questionListElement.iconAsterisk" stroke='questionListElement.iconAsterisk' w="9px" h="9px" />}
        </Flex>
      </Flex>
      {editQuestion &&
        <EditIcon
          w='20px'
          stroke="questionListElement.icon"
          cursor='pointer'
          onClick={editQuestion}
        />}
      {removeQuestion &&
        <Bin
          w='20px'
          stroke="questionListElement.icon"
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
    icon: "#818197",
    tooltipColor: "black",
    tooltipBg: "white"
  }
};
