import React, { Dispatch, SetStateAction } from "react";
import { Box, Collapse, Flex, Text } from "@chakra-ui/react";
import { MinusIcon } from "../../icons";
import { IGroupQuestion } from "../../interfaces/IGroupQuestion";
import { CheckIcon } from "../../icons/CheckIcon";
import QuestionAdditionalInformation from "./QuestionAdditionalInformation";

export interface QuestionGroupProps {
  questionGroupItem: IGroupQuestion;
  isExpanded: boolean;
  setExpandedItem: Dispatch<SetStateAction<string>>;
}

const QuestionGroup = ({
  questionGroupItem: { questionAnswered, id, totalQuestion, name, description },
  isExpanded,
  setExpandedItem,
}: QuestionGroupProps) => {
  return (
    <Box
      w="full"
      maxH="400px"
      onClick={() => setExpandedItem((prevState) => (isExpanded ? "" : id))}
      cursor="pointer"
    >
      <Collapse startingHeight="90px" endingHeight="270px" in={isExpanded}>
        <Box
          w="full"
          h="full"
          p="20px"
          bg="white"
          boxShadow="-1px 1px 9px 1px rgba(0 0 0  0.5)"
          borderRadius="10px"
        >
          <Flex justify="space-between">
            <Flex
              justify="center"
              align="center"
              w="5"
              h="5"
              borderRadius="50%"
              border={questionAnswered === 0 ? "1px solid #CBCCCD" : ""}
              bg={
                questionAnswered === 0
                  ? "transparent"
                  : questionAnswered < totalQuestion
                  ? "auditModal.menu.active.text"
                  : "auditModal.questionGroup.checked"
              }
              mr={5}
            >
              {questionAnswered === 0 ? (
                ""
              ) : questionAnswered < totalQuestion ? (
                <MinusIcon w="2.5" h="2.5" color="white" />
              ) : (
                <CheckIcon w="2.5" h="2.5" color="white" />
              )}
            </Flex>
            <Text lineHeight="20px" flexGrow={1} color="navigationTop.bg">
              {name}
            </Text>
            <Text lineHeight="20px" w={32} color="auditModal.menu.text">
              {questionAnswered} / {totalQuestion} Completed
            </Text>
          </Flex>
          <Text
            pl={10}
            mt={3}
            color="auditModal.menu.text"
            fontSize="sm"
            fontWeight={400}
          >
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
};
export default QuestionGroup;
