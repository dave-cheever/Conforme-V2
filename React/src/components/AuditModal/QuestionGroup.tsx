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
  <Box cursor="pointer" maxH="400px" onClick={() => setExpandedItem(() => (isExpanded ? '' : id))} w="full">
    <Collapse endingHeight="270px" in={isExpanded} startingHeight="90px">
      <Box bg="white" borderRadius="10px" boxShadow="-1px 1px 9px 1px rgba(0 0 0  0.5)" h="full" p="20px" w="full">
        <Flex justify="space-between">
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
            h="5"
            justify="center"
            mr={5}
            w="5"
          >
            {questionAnswered === 0 ? (
              ''
            ) : questionAnswered < totalQuestion ? (
              <MinusIcon color="white" h="2.5" w="2.5" />
            ) : (
              <CheckIcon color="white" h="2.5" w="2.5" />
            )}
          </Flex>
          <Text color="navigationTop.bg" flexGrow={1} lineHeight="20px">
            {name}
          </Text>
          <Text color="auditModal.menu.text" lineHeight="20px" w={32}>
            {questionAnswered} / {totalQuestion} Completed
          </Text>
        </Flex>
        <Text color="auditModal.menu.text" fontSize="sm" fontWeight={400} mt={3} pl={10}>
          {description}
        </Text>
        <br />
        <Box pl={10}>
          <QuestionAdditionalInformation />
        </Box>
      </Box>
    </Collapse>
  </Box>
);
export default QuestionGroup;
