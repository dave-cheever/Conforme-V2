import { FunctionComponent, useMemo } from "react";
import { Flex, Text } from "@chakra-ui/react";

import { ArrowRight, Filter } from "../icons";
import { useFiltersContext } from "../contexts/FiltersProvider";
import useDevice from "../hooks/useDevice";
import { useHistory } from "react-router-dom";

interface IHeader {
  breadcrumbs: string[];
  mobileBreadcrumbs?: string[];
}

const Header: FunctionComponent<IHeader> = ({
  children,
  breadcrumbs,
  mobileBreadcrumbs,
}) => {
  const {
    usedFilters,
    showFiltersPanel,
    setShowFiltersPanel,
    numberOfSelectedFilters,
  } = useFiltersContext();

  const device = useDevice();
  const history = useHistory();
  const breadCrumbs = useMemo(() => {
    if(device === "mobile"){
      return mobileBreadcrumbs || [];
    }

    return breadcrumbs;
  },[device, breadcrumbs, mobileBreadcrumbs]);

  const isAdminPage = history.location.pathname.split('/')[1] === "admin";
  const renderBreadcrumb = (breadcrumb: string, i: number) => (
    <Flex key={`bc-${i}`} h="full" align="center">
      {i > 0 && (
        <ArrowRight color="#818197" ml={2} mt={["0px","5px"]} mr={1} display="flex" />
      )}
      <Text
        pl={[0, 2]}
        mr={1}
        color={
          i === breadCrumbs.length - 1
            ? "header.breadcrumbPrimary"
            : "header.breadcrumbSecondary"
        }
        display={i === breadCrumbs.length - 1 ? "flex" : "flex"}
        fontWeight={i === breadCrumbs.length - 1 ? "700" : "400"}
      >
        {breadcrumb}
      </Text>
    </Flex>
  );

  return (
    <Flex position="relative" align="center" h={["60px","70px"]}>
      <Flex
        w="full"
        justify="space-between"
      >
        <Flex
          flexShrink={0}
          ml="6"
          display="flex"
        >
          {breadCrumbs.map(renderBreadcrumb)}
        </Flex>
        <Flex w="full" justify="flex-end" mr="20px">
          {children}
        </Flex>
        {usedFilters && !isAdminPage && usedFilters.length > 0 && (
          <Flex
            minW="120px"
            flexShrink={0}
            h="40px"
            mr={[6, 6, 4]}
            borderRadius="10px"
            bg="header.filterBackgroundColor"
            cursor="pointer"
            align="center"
            p={4}
            justify="space-between"
            fontSize="sm"
            color="brand.primaryFont"
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
          >
            <Flex color="white" fontWeight="bold" fontSize="14px">Filters</Flex>
            {numberOfSelectedFilters > 0 && (
              <Flex
                bg="header.selectedFilterColor"
                mx="2"
                align="center"
                justify="center"
                h="20px"
                w="27px"
                lineHeight="14px"
                fontWeight="400"
                color="white"
                fontSize="12px"
                borderRadius="10px"
              >
                {numberOfSelectedFilters}
              </Flex>
            )}
            <Filter ml={3} h="18px" transform={numberOfSelectedFilters > 0 ? "rotate(180deg)":""}/>
          </Flex>
        )}
      </Flex>
    </Flex>
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
    selectedFilterColor: "#818197"
  }
}
