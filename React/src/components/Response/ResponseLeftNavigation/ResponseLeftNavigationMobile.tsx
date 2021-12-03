import React from "react";
import { useHistory } from "react-router-dom";
import { Divider, Flex } from "@chakra-ui/react";

import { ChevronRight } from "../../../icons";
import { navigationTabs } from "../../../bootstrap/config";
import ResponseLeftTabItem from "../ResponseLeftTabItem";
import ResponseDetail from "./ResponseDetail";
import { useResponseContext } from "../../../contexts/ResponseProvider";

const ResponseLeftNavigationMobile = () => {
  const history = useHistory();

  const { response } = useResponseContext();

  return (
    <Flex
      color="responseLeftNavigation.color"
      bg="white"
      fontWeight="400"
      direction="column"
      w="full"
      h="60px"
      justifyContent="space-between"
      display={["block", "none", "none"]}
      position="fixed"
      bottom="0px"
      p="10px"
      zIndex={12}
      align="center"
      boxShadow="0px 0px 80px rgba(49, 50, 51, 0.15)"
    >
      <Flex flexDirection="row" h="full" align="center">
        <Flex
          cursor="pointer"
          align="center"
          onClick={() => history.push("/compliance-items")}
          color="responseLeftNavigation.goBackColor"
          fontSize="14px"
          h="30px"
          mr={3}
        >
          <ChevronRight transform="Rotate(180deg)" ml={2} />
          <Divider orientation='vertical' ml={3}/>
        </Flex>
        <Flex w="full" justify="space-between">
          <Flex w="full">
          {navigationTabs.map(({ label, icon, url }) => (
            <ResponseLeftTabItem
              isDesktop={false}
              key={url}
              label={label}
              icon={icon}
              url={url}
              isMobile={true}
            />
          ))}
          </Flex>
          <ResponseDetail response={response} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ResponseLeftNavigationMobile;
