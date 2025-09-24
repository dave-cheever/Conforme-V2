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

function QuestionGroup({
  questionGroupItem: { questionAnswered, id, totalQuestion, name, description },
  isExpanded,
  setExpandedItem,
}: QuestionGroupProps) {
  return (
    <Box
      data-id="000448"
      cursor="pointer"
      maxH="400px"
      onClick={() => setExpandedItem(() => (isExpanded ? '' : id))}
      w="full">
      <Collapse
        data-id="000449"
        endingHeight="270px"
        in={isExpanded}
        startingHeight="90px">
        <Box
          data-id="000450"
          bg="white"
          borderRadius="10px"
          boxShadow="-1px 1px 9px 1px rgba(0 0 0  0.5)"
          h="full"
          p="20px"
          w="full">
          <Flex data-id="000451" justify="space-between">
            <Flex
              data-id="000452"
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
              h="5"
              justify="center"
              mr={5}
              w="5">
              {questionAnswered === 0 ? (
                ''
              ) : questionAnswered < totalQuestion ? (
                <MinusIcon data-id="000453" color="white" h="2.5" w="2.5" />
              ) : (
                <CheckIcon data-id="000454" color="white" h="2.5" w="2.5" />
              )}
            </Flex>
            <Text
              data-id="000455"
              color="navigationTop.bg"
              flexGrow={1}
              lineHeight="20px">
              {name}
            </Text>
            <Text
              data-id="000456"
              color="auditModal.menu.text"
              lineHeight="20px"
              w={32}>
              {questionAnswered} / {totalQuestion} Completed
            </Text>
          </Flex>
          <Text
            data-id="000457"
            color="auditModal.menu.text"
            fontSize="sm"
            fontWeight={400}
            mt={3}
            pl={10}>
            {description}
          </Text>
          <br data-id="000458" />
          <Box data-id="000459" pl={10}>
            <QuestionAdditionalInformation data-id="000460" />
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}
export default QuestionGroup;
