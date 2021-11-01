import { Box, Flex, Stack } from "@chakra-ui/react";

import Chart from "../../components/Chart";
import Header from "../../components/Header";

const Categories = () => {
  const categories: { count: number; _id: string; name: string }[] = [
    {
      count: 2,
      _id: "1",
      name: "Accreditation",
    },
    {
      count: 3,
      _id: "2",
      name: "Acreditation",
    },
  ];

  return (
    <>
      <Header breadcrumbs={["Admin", "Categories"]} hideBreadcrumbsOnMobile />
      <Box p={["0", "30px"]} h="calc(100vh - 150px)" overflow="auto">
        <Flex flexDirection={["column-reverse", "row"]}>
          <Box w={["100%", "calc(100% - 250px)"]} mr="50px">
            <Flex
              fontWeight="400"
              color="categories.fontColor"
              mb="14px"
              display={["none", "flex"]}
            >
              <Flex w="64%">Category</Flex>
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
              {/* {categories?.length > 0 ? (
                categories?.map((category, i) => AdminTableRow(category, i))
              ) : (
                <Flex w="full" h="full" fontSize="18px" fontStyle="italic">
                  No categories found
                </Flex>
              )} */}
            </Stack>
          </Box>
          <Flex
            flexDirection="column"
            alignItems="center"
            w={["100%", "220px"]}
          >
            <Box w="100%">
              {categories && <Chart items={categories} label="category" />}
            </Box>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default Categories;
