import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/layout";
import QuestionAdditionalInformation from "./QuestionAdditionalInformation";
import {
  groupQuestionsByCategory,
  groupQuestionsByKLOE,
  IGroupQuestion,
} from "../../interfaces/IGroupQuestion";
import { Button, ButtonGroup, VStack } from "@chakra-ui/react";
import QuestionGroup from "./QuestionGroup";

const arrowPointerActiveStyle = {
  content: `''`,
  position: "absolute",
  width: 0,
  height: 0,
  left: 0,
  right: 0,
  bottom: "-8px",
  margin: "auto",
  borderTop: "11px solid",
  borderTopColor: "navigationTop.addButton",
  borderLeft: "9.5px solid transparent",
  borderRight: "9.5px solid transparent",
  transitionProperty: "all",
  transitionDuration: "var(--chakra-transition-duration-normal)",
};

const arrowPointerStyle = {
  content: `''`,
  position: "absolute",
  width: 0,
  height: 0,
  left: 0,
  right: 0,
  bottom: "0",
  margin: "auto",
  borderTop: "0 solid",
  borderTopColor: "navigationTop.addButton",
  borderLeft: "0 solid transparent",
  borderRight: "0 solid transparent",
};

const QuestionsSection = () => {
  const [questionGroups, setQuestionGroups] = useState<IGroupQuestion[]>([]);
  const [expandedItem, setExpandedItem] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<"category" | "kloe">(
    "category"
  );
  useEffect(() => {
    setQuestionGroups((prevState) =>
      selectedGroup === "category"
        ? groupQuestionsByCategory
        : groupQuestionsByKLOE
    );
  }, [selectedGroup]);
  return (
    <Box>
      <ButtonGroup spacing={2.5} pr={2}>
        <Button
          w="130px"
          h="36px"
          color={
            selectedGroup === "category"
              ? "white"
              : "auditModal.menu.active.text"
          }
          onClick={() => setSelectedGroup("category")}
          colorScheme={
            selectedGroup === "category"
              ? "auditModal.questionGroup.activeButton"
              : "auditModal.questionGroup.nonActiveButton"
          }
          borderRadius="10px"
          fontSize="14px"
          _after={
            selectedGroup === "category"
              ? arrowPointerActiveStyle
              : arrowPointerStyle
          }
        >
          By Category
        </Button>
        <Button
          w="130px"
          h="36px"
          onClick={() => setSelectedGroup("kloe")}
          color={
            selectedGroup === "kloe" ? "white" : "auditModal.menu.active.text"
          }
          colorScheme={
            selectedGroup === "kloe"
              ? "auditModal.questionGroup.activeButton"
              : "auditModal.questionGroup.nonActiveButton"
          }
          borderRadius="10px"
          fontSize="14px"
          _after={
            selectedGroup === "kloe"
              ? arrowPointerActiveStyle
              : arrowPointerStyle
          }
        >
          By KLOE
        </Button>
      </ButtonGroup>
      <VStack
        spacing={2}
        mt={4}
        w="full"
        maxH="calc(100% - 40px)"
        pr={2}
        overflow="auto"
      >
        {questionGroups.map((item) => (
          <QuestionGroup
            key={item.id}
            isExpanded={item.id === expandedItem}
            questionGroupItem={item}
            setExpandedItem={setExpandedItem}
          />
        ))}
      </VStack>
      <br />
      <QuestionAdditionalInformation />
    </Box>
  );
};

export default QuestionsSection;
