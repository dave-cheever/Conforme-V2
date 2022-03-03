import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

import { useResponseContext } from "../../contexts/ResponseProvider";
import TeamProvider from "../../contexts/TeamProvider";
import Loader from "../../components/Loader";
import HistoricalListItem from "../../components/Response/HistoricalListItem";
import { getTime } from "date-fns";

const Team = () => {
  const { snapshotsLoading, snapshots } = useResponseContext();

  if (snapshotsLoading) {
    return (
      <Flex w="full" h="full" rounded="20px" bg="teamPage.bg">
        <Loader center={true} />
      </Flex>
    );
  }

  return (
    <Box
      bg="historyPage.bg"
      w="full"
      minH="full"
      h="fit-content"
      borderRadius="20px"
      pb={7}
      mb={7}
    >
      <Flex
        p="15px 25px"
        fontWeight="semi_medium"
        borderBottom="1px solid"
        borderColor="historyPage.border"
        borderTopRadius="20px"
        bg="white"
        color="historyPage.font"
        fontSize="11px"
      >
        <Flex w='30%' alignItems="center">
          <Text>Item name</Text>
        </Flex>
        <Flex w='20%' alignItems="center">
          <Text>Renewed</Text>
        </Flex>
        <Flex w='25%' alignItems="center">
          <Text>Responsible</Text>
        </Flex>
        <Flex w='25%' alignItems="center">
          <Text>Last updated by</Text>
        </Flex>
      </Flex>
      <Flex
        flexDir="column"
        overflowY="auto"
        w="full"
        h={["full", "calc(100vh - 280px)", "calc(100vh - 270px)"]}
      >
        {snapshots.map((response) => (
          <HistoricalListItem key={getTime(new Date(response.lastRenewalDate!))} response={response} />
        ))}
        {snapshots.length === 0 && (
          <Flex w="full" h="full" mt={4} fontSize="18px" fontStyle="italic" justify="center">
            No historical compliance item responses found
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

const TeamWithContext = (props) => (
  <TeamProvider {...props}>
    <Team {...props} />
  </TeamProvider>
);

export const historyPageStyles = {
  historyPage: {
    bg: "#FFFFFF",
    border: "#F0F0F0",
    font: "#818197",
  },
};

export default TeamWithContext;
