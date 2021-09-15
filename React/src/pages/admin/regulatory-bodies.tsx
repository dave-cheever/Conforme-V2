import { Box, Flex, Stack } from "@chakra-ui/react";

import AdminTableRow from "../../components/AdminTableRow";
import Chart from "../../components/Chart";
import Header from "../../components/Header";

const RegulatoryBodies = () => {
  const bodies: { count: number; id: string; name: string }[] = [
    {
      count: 2,
      id: "1",
      name: "Reg 1",
    },
    {
      count: 3,
      id: "2",
      name: "Reg 2",
    },
  ];
  return (
    <>
      <Header
        breadcrumbs={["Admin", "Regulatory bodies"]}
        hideBreadcrumbsOnMobile
      />
      <Box p={["0", "30px"]} h="calc(100vh - 150px)" overflow="auto">
        <Flex flexDirection={["column-reverse", "row"]}>
          <Box w={["100%", "calc(100% - 250px)"]} mr="50px">
            <Flex
              fontWeight="400"
              color="regulatoryBodies.fontColor"
              mb="14px"
              display={["none", "flex"]}
            >
              <Flex w="64%">Regulatory body</Flex>
              <Flex w="25%">Responses count</Flex>
              <Box w="11%" textAlign="right">
                Actions
              </Box>
            </Flex>
            <Stack
              borderRadius={["0", "10px"]}
              overflow="hidden"
              spacing={["0", "1px"]}
              mt={["20px", "0"]}
            >
              {bodies?.length > 0 ? (
                bodies?.map((regulatoryBody, i) =>
                  AdminTableRow(regulatoryBody, i)
                )
              ) : (
                <Flex w="full" h="full" fontSize="18px" fontStyle="italic">
                  No regulatory body found
                </Flex>
              )}
            </Stack>
          </Box>
          <Flex
            flexDirection="column"
            alignItems="center"
            w={["100%", "220px"]}
          >
            <Box w="100%">
              {bodies && <Chart items={bodies} label="regulatory body" />}
            </Box>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default RegulatoryBodies;
