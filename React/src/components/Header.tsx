import { FunctionComponent } from "react";
import { Flex, Text, Box } from "@chakra-ui/react";

import { useHistory } from "react-router";
import { ArrowRight } from "../icons";

interface IHeader {
  breadcrumbs: string[];
  hideBreadcrumbsOnMobile?: boolean;
  itemsCount?: number;
}

const Header: FunctionComponent<IHeader> = ({
  children,
  breadcrumbs,
  hideBreadcrumbsOnMobile,
  itemsCount,
}) => {
  const history = useHistory();

  const renderBreadcrumb = (breadcrumb: string, i: number) => (
    <Flex key={`bc-${i}`} align="center">
      {i > 0 && (
        <ArrowRight ml={2} mr={1} h="12px" display={["none", "flex"]} />
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
    <Box position="relative">
      <Flex
        w="full"
        h={["60px", "70px"]}
        pt={["0", "2"]}
        bg="header.bg"
        justify="space-between"
      >
        <Flex
          flexShrink={0}
          ml="6"
          display={hideBreadcrumbsOnMobile ? "flex" : ["none", "flex"]}
        >
          {breadcrumbs.map(renderBreadcrumb)}
        </Flex>
        {history.location.pathname === "/compliance-items" && (
          <Box
            bg="header.countFontColor"
            minWidth="min-content"
            color="white"
            align="center"
            ml="6"
            fontSize="11px"
            alignSelf="center"
            p={1}
            lineHeight="13px"
            rounded="5px"
            fontWeight="700"
            display={["none", "block"]}
          >
            {itemsCount}
          </Box>
        )}

        <Flex w="full" justify="flex-end" mr="85px">
          {children}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
