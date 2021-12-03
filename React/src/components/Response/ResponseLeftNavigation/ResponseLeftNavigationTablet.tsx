import React from "react";
import { useHistory } from "react-router-dom";
import { Flex, Icon, Box, Text } from "@chakra-ui/react";

import { ChevronRight, ConformeSmall } from "../../../icons";
import { navigationTabs } from "../../../bootstrap/config";
import ResponseLeftTabItem from "../ResponseLeftTabItem";
import ResponseDetail from "./ResponseDetail";
import { useResponseContext } from "../../../contexts/ResponseProvider";

const ResponseLeftNavigationTablet = () => {
  const history = useHistory();

  const { response } = useResponseContext();

  return (
    <Flex
      color="responseLeftNavigation.color"
      bg="responseLeftNavigation.bg"
      fontWeight="400"
      direction="column"
      w="80px"
      h="100vh"
      overflow="auto"
      flexShrink={0}
      px={6}
      justifyContent="space-between"
      display={["none", "flex", "none"]}
    >
      <Flex flexDirection="column">
        <Box
          display="flex"
          alignItems="center"
          h="80px"
          onClick={() => history.push('/')}
          cursor="pointer"
          justifyContent="center"
          >
          <Text
            fontWeight="bold"
            fontSize="16px"
            color="navigationLeft.organizationNameFontColor"
          >
            {"G"}
          </Text>
        </Box>
        <Flex
          w="full"
          cursor="pointer"
          align="center"
          onClick={() => history.push("/compliance-items")}
          color="responseLeftNavigation.goBackColor"
          fontSize="14px"
          h="30px"
          mb="20px"
        >
          <ChevronRight transform="Rotate(180deg)" ml={2} />
        </Flex>
        <Flex flexDirection="column" mb={2}>
          {navigationTabs.map(({ label, icon, url }) => (
            <ResponseLeftTabItem
              isDesktop={false}
              key={url}
              label={label}
              icon={icon}
              url={url}
            />
          ))}
        </Flex>
        <ResponseDetail response={response} />
      </Flex>
      <Flex display={["none", "flex"]}>
        <Icon as={ConformeSmall} w="27px" h="30px" mb="20px" />
      </Flex>
    </Flex>
  );
};

export default ResponseLeftNavigationTablet;
