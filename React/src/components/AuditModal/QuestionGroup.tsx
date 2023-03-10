import React, { Dispatch, SetStateAction } from 'react';

import { Box, Collapse, Flex, Text } from '@chakra-ui/react';

import { CheckIcon, MinusIcon } from '../../icons';
import { IGroupQuestion } from '../../interfaces/IGroupQuestion';
import QuestionAdditionalInformation from './QuestionAdditionalInformation';

export interface QuestionGroupProps {
  questionGroupItem: IGroupQuestion;
  isExpanded: boolean;
  setExpandedItem: Dispatch<SetStateAction<string>>;
}

const QuestionGroup = ({
  questionGroupItem: { questionAnswered, id, totalQuestion, name, description },
  isExpanded,
  setExpandedItem,
}: QuestionGroupProps) => (
  <Box
    cursor="pointer"
    data-id="895459aec803"
    maxH="400px"
    onClick={() => setExpandedItem(() => (isExpanded ? '' : id))}
    w="full">
    <Collapse
      data-id="2656f701b8c1"
      endingHeight="270px"
      in={isExpanded}
      startingHeight="90px">
      <Box
        bg="white"
        borderRadius="10px"
        boxShadow="-1px 1px 9px 1px rgba(0 0 0  0.5)"
        data-id="c59db9cf6347"
        h="full"
        p="20px"
        w="full">
        <Flex data-id="e093c3b3f9f0" justify="space-between">
          <Flex
            align="center"
            bg={
              questionAnswered === 0
                ? 'transparent'
                : questionAnswered < totalQuestion
                ? 'auditModal.menu.active.text'
                : 'auditModal.questionGroup.checked'
            }
            border={questionAnswered === 0 ? '1px solid #CBCCCD' : ''}
            borderRadius="50%"
            data-id="2fcabcbcd0f8"
            h="5"
            justify="center"
            mr={5}
            w="5">
            {questionAnswered === 0 ? (
              ''
            ) : questionAnswered < totalQuestion ? (
              <MinusIcon color="white" data-id="2cd90abb8ca6" h="2.5" w="2.5" />
            ) : (
              <CheckIcon color="white" data-id="c0b4ee40a782" h="2.5" w="2.5" />
            )}
          </Flex>
          <Text
            color="navigationTop.bg"
            data-id="515c1dce642e"
            flexGrow={1}
            lineHeight="20px">
            {name}
          </Text>
          <Text
            color="auditModal.menu.text"
            data-id="1999bcda7169"
            lineHeight="20px"
            w={32}>
            {questionAnswered} / {totalQuestion} Completed
          </Text>
        </Flex>
        <Text
          color="auditModal.menu.text"
          data-id="827b7c3822be"
          fontSize="sm"
          fontWeight={400}
          mt={3}
          pl={10}>
          {description}
        </Text>
        <br data-id="d8cd224d3442" />
        <Box data-id="6d745a27f5d5" pl={10}>
          <QuestionAdditionalInformation data-id="fd4f804f23c8" />
        </Box>
      </Box>
    </Collapse>
  </Box>
);
export default QuestionGroup;
