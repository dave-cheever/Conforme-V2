import { Box, Flex, Stack } from "@chakra-ui/react";
import AdminTableRow from "../../components/AdminTableRow";

import Chart from "../../components/Chart";
import Header from "../../components/Header";

const FunctionalAreas = () => {
  const areas: { count: number; id: string; name: string }[] = [
    {
      count: 2,
      id: "1",
      name: "Area 1",
    },
    {
      count: 3,
      id: "2",
      name: "Area 2",
    },
  ];

  return (
    <>
      <Header
        breadcrumbs={["Admin", "Functional areas"]}
        hideBreadcrumbsOnMobile
      />
      <Box p={["0", "30px"]} h="calc(100vh - 150px)" overflow="auto">
        <Flex flexDirection={["column-reverse", "row"]}>
          <Box w={["100%", "calc(100% - 250px)"]} mr="50px">
            <Flex
              fontWeight="400"
              color="functionalAreas.fontColor"
              mb="14px"
              display={["none", "flex"]}
            >
              <Flex w="64%">Functional area</Flex>
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
              {areas?.length > 0 ? (
                areas?.map((area, i) => AdminTableRow(area, i))
              ) : (
                <Flex w="full" h="full" fontSize="18px" fontStyle="italic">
                  No functional areas found
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
              {areas && <Chart items={areas} label=" functional area" />}
            </Box>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default FunctionalAreas;
