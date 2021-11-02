import { Box, Flex, Text } from "@chakra-ui/layout";
import { useState } from "react";
import * as Icons from "../../icons";
import QuestionAdditionalButton from "./QuestionAdditionalButton";

const QuestionAdditionalInformation = () => {
  const [activeInformation, setActiveInformation] = useState("Actions");
  return (
    <Box>
      <Text fontSize="16px" fontWeight="400">
        Provide additional information or actions
      </Text>
      <br />
      <Flex alignItems="center">
        <QuestionAdditionalButton
          label="Actions"
          icon={Icons.HealthKitIcon}
          requiredIcon={Icons.RequiredIcon}
          activeInformation={activeInformation}
          setActiveInformation={setActiveInformation}
        />
        <QuestionAdditionalButton
          label="Attachments"
          icon={Icons.AttachmentIcon}
          activeInformation={activeInformation}
          setActiveInformation={setActiveInformation}
        />
        <QuestionAdditionalButton
          label="More detail"
          icon={Icons.DetailIcon}
          activeInformation={activeInformation}
          setActiveInformation={setActiveInformation}
        />
      </Flex>
    </Box>
  );
};

export default QuestionAdditionalInformation;
