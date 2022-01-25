import React from "react";
import { Box, Flex, Stack, Text } from "@chakra-ui/react";

import { useResponseContext } from '../../contexts/ResponseProvider';
import Attachment from './Attachment';
import Evidence from './Evidence';
import EvidenceHistoryList from "./EvidenceHistoryList"

const Attachments = () => {
  const { response } = useResponseContext();
  
  return (
    <Flex w="full" h="full" overflow={["visible","auto"]} flexDirection={["column", "row"]} align={["center", "flex-start"]}>
      <Flex flexDirection="column" mr={[0, 2]} h="full" w="full">
      <Text fontSize="sm" fontWeight="medium">Evidence Expected <Box as="span" color="red">(required)</Box></Text>
      <Text fontSize="sm" my={1}>Upload all expected evidence and complete any required question to record this compliance item as complete.</Text>
        <Stack spacing={4} align={["center", "flex-start"]} w="full">
          {response?.evidence
            .filter(({ outdated }) => !outdated)
            .map((evidence, i) => (
              <Evidence key={i} evidence={evidence} />
            ))}
          <EvidenceHistoryList />
        </Stack>
      </Flex>
      <Flex ml={[0, 2]} h="full" w="full" justify={["center", "flex-start"]}>
        <Attachment />
      </Flex>
    </Flex>
  );
};

export default Attachments;
