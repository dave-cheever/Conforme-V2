import React, { useEffect, useRef, useState } from 'react';

import { Flex, Stack, Text, Tooltip } from '@chakra-ui/react';

import { Asterisk, EditIcon, Trashcan } from '../../icons';
import { ITrackerQuestion } from '../../interfaces/ITrackerQuestion';
import { TQuestionValue } from '../../interfaces/TQuestionValue';
import { questionHeader } from '../../utils/helpers';

interface IQuestionListElement {
  question: ITrackerQuestion<TQuestionValue>;
  bgColor?: string;
  removeQuestion?: () => void;
  editQuestion?: () => void;
}
function QuestionListElement({ question, bgColor, removeQuestion, editQuestion }: IQuestionListElement) {
  const ref: any = useRef(null);
  const [isTextOverflown, setIsTextOverflown] = useState(false);

  useEffect(() => {
    const element = ref.current!;
    if (element) {
      // only show tooltip if text overflow is happening.
      setIsTextOverflown(element.scrollHeight > element.clientHeight);
    }
  }, []);

  return (
    <Stack
        align="center"
        bg={bgColor || 'questionListElement.bg'}
        borderColor="questionListElement.border"
        borderWidth="2px"
        data-id="000267"
        direction="row"
        minH="65px"
        px={4}
        rounded="10px"
        spacing={2}
        w="calc(100% - 1rem)">
      <Flex data-id="000268" flexDir="column" w="calc(100% - 40px)">
        <Text color="questionListElement.label" data-id="000269" fontSize="11px">
          {questionHeader(question.type)}
        </Text>
        <Flex alignItems="center" data-id="000270" flexGrow={1} w="full">
          <Tooltip
            bg="questionListElement.tooltipBg"
            color="questionListElement.tooltipColor"
            data-id="000271"
            hasArrow
            isDisabled={!isTextOverflown}
            label={question.name}
            placement="top">
            <Text
              color="questionListElement.name"
              data-id="000272"
              fontSize="smm"
              fontWeight="bold"
              noOfLines={4}
              ref={ref}>
              {question.name}
            </Text>
          </Tooltip>
          {question.required && (
            <Asterisk
              data-id="000273"
              fill="questionListElement.iconAsterisk"
              h="9px"
              mb="8px"
              ml="5px"
              stroke="questionListElement.iconAsterisk"
              w="9px" />
          )}
        </Flex>
      </Flex>
      {editQuestion && <EditIcon
        cursor="pointer"
        data-id="000274"
        onClick={editQuestion}
        stroke="questionListElement.icon"
        w="20px" />}
      {removeQuestion && <Trashcan
        cursor="pointer"
        data-id="000275"
        onClick={removeQuestion}
        stroke="questionListElement.icon"
        w="20px" />}
    </Stack>
  );
}

export default QuestionListElement;

export const questionListElementStyles = {
  questionListElement: {
    bg: '#FFFFFF',
    border: '#FFFFFF',
    name: '#2B3236',
    label: '#818197',
    iconAsterisk: '#E93C44',
    icon: '#818197',
    tooltipColor: 'black',
    tooltipBg: 'white',
  },
};
