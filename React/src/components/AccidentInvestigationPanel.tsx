import React from "react";
import { Avatar } from "@chakra-ui/avatar";
import { Button } from "@chakra-ui/button";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { MessageIcon, RedDotIcon, InvestigationWhiteIcon } from "../icons";
import Icon from "@chakra-ui/icon";

const AccidentInvestigationPanel = () => {
  return (
    <Box
      w="270px"
      h="312px"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="0px 4px 10px rgba(0, 0, 0, 0.05)"
    >
      <Flex bg="investigationPanel.header" alignItems="center" px="4" h="37px">
        <Icon as={InvestigationWhiteIcon} color="black" h="16px" />
        <Text
          pl="2"
          color="investigationPanel.headerText"
          fontSize="14px"
          fontWeight="400"
        >
          Accident Investigation
        </Text>
      </Flex>
      <Box w="100%" h="100%" bg="investigationPanel.bg" pt="3">
        <Flex align="center">
          <Box
            h="50px"
            w="5px"
            display={["none", "block"]}
            bg="investigationPanel.ribbon"
            roundedRight="4px"
          >
            &nbsp;
          </Box>
          <Text
            fontSize="24px"
            fontWeight="700"
            ml="4"
            color="investigationPanel.text"
          >
            102
          </Text>
        </Flex>
        <Box p="3" w="100%" ml="3">
          <Text fontSize="12px" color="investigationPanel.header">
            Site
          </Text>
          <Text fontSize="14px" color="investigationPanel.text">
            The Meridan Hospital
          </Text>
        </Box>
        <Flex>
          <Box px="3" py="4" w="100%" ml="3">
            <Text fontSize="12px" color="investigationPanel.header">
              Assigned to
            </Text>
            <Flex alignItems="center">
              <Avatar
                color="black"
                bg="black"
                rounded="full"
                name=""
                size="sm"
                src=""
                mr={2}
                w="18px"
                h="18px"
              />
              <Text fontSize="14px">You</Text>
            </Flex>
          </Box>
          <Box px="3" py="4" w="100%">
            <Text fontSize="12px" color="investigationPanel.header">
              Event date
            </Text>
            <Text fontSize="14px" color="investigationPanel.text">
              24 August 2021
            </Text>
            <Text fontSize="14px" color="investigationPanel.text">
              10:00 PM
            </Text>
          </Box>
        </Flex>
        <Flex>
          <Flex p="3" w="100%" align="center" ml="3">
            <Box position="relative">
              <MessageIcon mt="-4px" />
              <RedDotIcon position="absolute" top="2px" left="4px" h="13px" />
            </Box>
          </Flex>
          <Box p="3" w="100%">
            <Button
              bg="investigationPanel.button"
              color="white"
              w="100px"
              h="30px"
              fontSize="14px"
              _focus={{ color: "white", bg: "black" }}
              _hover={{ color: "white", bg: "black" }}
            >
              Investigate
            </Button>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default AccidentInvestigationPanel;
