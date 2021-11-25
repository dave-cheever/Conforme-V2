import { FunctionComponent } from "react";
import { Flex, Text, Box } from "@chakra-ui/react";

import { ArrowRight, Filter } from "../icons";
import { useFiltersContext } from "../contexts/FiltersProvider";

interface IHeader {
  breadcrumbs: string[];
  hideBreadcrumbsOnMobile?: boolean;
}

const Header: FunctionComponent<IHeader> = ({
  children,
  breadcrumbs,
  hideBreadcrumbsOnMobile,
}) => {
  const {
    usedFilters,
    showFiltersPanel,
    setShowFiltersPanel,
    numberOfSelectedFilters,
  } = useFiltersContext();

  const renderBreadcrumb = (breadcrumb: string, i: number) => (
    <Flex key={`bc-${i}`} align="center">
      {i > 0 && (
        <ArrowRight stroke="#818197" ml={2} mr={1} display={["none", "flex"]} />
      )}
      <Text
        pl={[0, 2]}
        mr={1}
        color={
          i === breadcrumbs.length - 1
            ? "header.breadcrumbPrimary"
            : "header.breadcrumbSecondary"
        }
        display={i === breadcrumbs.length - 1 ? "flex" : ["none", "flex"]}
        fontWeight={i === breadcrumbs.length - 1 ? "700" : "400"}
      >
        {breadcrumb}
      </Text>
    </Flex>
  );

  return (
    <Box position="relative" mb="10px">
      <Flex
        w="full"
        h={["60px", "70px"]}
        pt={["0", "2"]}
        justify="space-between"
      >
        <Flex
          flexShrink={0}
          ml="6"
          display={hideBreadcrumbsOnMobile ? "flex" : ["none", "flex"]}
        >
          {breadcrumbs.map(renderBreadcrumb)}
        </Flex>
        <Flex w="full" justify="flex-end" mr="20px">
          {children}
        </Flex>
        {usedFilters && usedFilters.length > 0 && (
          <Flex
            w="120px"
            flexShrink={0}
            h="40px"
            mr={4}
            mt={2}
            borderTopRadius="lg"
            borderBottomRadius="lg"
            bg="header.filterBackgroundColor"
            lineHeight="36px"
            cursor="pointer"
            align="center"
            p={4}
            justify="space-between"
            fontSize="sm"
            color="brand.primaryFont"
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
          >
            <Flex color="white" fontWeight="bold" fontSize="sm">Filters</Flex>
            {numberOfSelectedFilters > 0 && (
              <Box
                bg="header.selectedFilterColor"
                ml="2"
                align="center"
                w="20px"
                h="20px"
                lineHeight="20px"
                rounded="md"
                fontWeight="700"
                color="white"
              >
                {numberOfSelectedFilters}
              </Box>
            )}
            <Filter ml={1} h="18px" />
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default Header;

export const headerStyles = {
  header:{
    bg: "#2B3236",
    breadcrumbPrimary: "#282F36",
    breadcrumbSecondary: "#818197",
    countFontColor: "#424B50",
    filterBackgroundColor: "#282F36",
    selectedFilterColor: "#462AC4"
  }
}
