import React from "react";
import { Button } from "@chakra-ui/button";
import { Box, Flex, Text } from "@chakra-ui/layout";
import {
  MessageIcon,
  RedDotIcon,
  FileRightIcon,
  LicensesWhiteIcon,
} from "../icons";
import Icon from "@chakra-ui/icon";

const LicensesPanel = () => {
  return (
    <Box
      w="270px"
      h="312px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="0px 4px 10px rgba(0, 0, 0, 0.05)"
    >
      <Flex bg="licensesPanel.header" alignItems="center" px="4" h="37px">
        <Icon as={LicensesWhiteIcon} color="black" h="16px" />
        <Text
          pl="2"
          color="licensesPanel.headerText"
          fontSize="14px"
          fontWeight="400"
        >
          Licenses
        </Text>
      </Flex>
      <Box w="100%" h="100%" bg="licensesPanel.bg" pt="3">
        <Flex align="center">
          <Box
            h="50px"
            w="5px"
            display={["none", "block"]}
            bg="licensesPanel.ribbon"
            roundedRight="4px"
          >
            &nbsp;
          </Box>
          <Text
            fontSize="14px"
            fontWeight="700"
            ml="4"
            color="licensesPanel.text"
          >
            Alcohol Premises License
          </Text>
        </Flex>
        <Box p="3" w="100%" ml="3">
          <Text fontSize="12px" color="licensesPanel.header">
            Location
          </Text>
          <Text fontSize="14px" color="#313233">
            The Meridan Hospital
          </Text>
        </Box>
        <Flex>
          <Box px="3" py="6" w="100%" ml="3">
            <Text fontSize="12px" color="licensesPanel.header">
              Regulatory body
            </Text>
            <Flex alignItems="center">
              <Text fontSize="14px">Local authority</Text>
            </Flex>
          </Box>
          <Box px="3" py="6" w="100%">
            <Text fontSize="12px" color="licensesPanel.header">
              Next renewal on
            </Text>
            <Text fontSize="14px" color="#313233">
              13 August 2021
            </Text>
          </Box>
        </Flex>
        <Flex>
          <Flex px="3" pt="4" w="100%" align="center" ml="3">
            <FileRightIcon />
            <Text fontSize="14px" marginX="2" fontWeight="800" color="#313233">
              0
            </Text>
            <Box position="relative">
              <MessageIcon mt="-4px" />
              <RedDotIcon position="absolute" top="2px" left="4px" h="13px" />
            </Box>
          </Flex>
          <Box px="3" pt="4" w="100%">
            <Button
              bg="licensesPanel.button"
              color="white"
              w="100px"
              h="30px"
              fontSize="14px"
              _focus={{ color: "white", bg: "black" }}
              _hover={{ color: "white", bg: "black" }}
            >
              View
            </Button>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default LicensesPanel;
