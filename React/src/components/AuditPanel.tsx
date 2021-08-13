import React from "react";
import { Avatar } from "@chakra-ui/avatar";
import { Button } from "@chakra-ui/button";
import { Box, Flex, Spacer, Text } from "@chakra-ui/layout";
import {
  MessageIcon,
  HealthKitIcon,
  AtTheRateIcon,
  AuditWhiteIcon,
  RedDotIcon,
} from "../icons";
import Icon from "@chakra-ui/icon";
import ProgressBar from "./ProgressBar";

interface IAuditPanel {
  isMentioned?: boolean;
  open: () => void;
}

const AuditPanel = ({ isMentioned, open }: IAuditPanel) => {
  return (
    <Box w="270px" h="312px" borderRadius="lg" overflow="hidden">
      <Flex
        bg={isMentioned ? "auditPanel.mentionHeader" : "auditPanel.header"}
        alignItems="center"
        px="4"
        h="37px"
      >
        <Icon as={AuditWhiteIcon} color="black" h="16px" />
        <Text
          pl="2"
          color="auditPanel.headerText"
          fontSize="14px"
          fontWeight="400"
        >
          Audit
        </Text>
        <Spacer />
        <Flex alignItems="center" justifyContent="center">
          <ProgressBar value={0} />
          <Text color="auditPanel.headerText" fontSize="12px">
            0%
          </Text>
        </Flex>
      </Flex>
      <Box w="100%" h="100%" bg="auditPanel.bg" pt="3">
        <Flex align="center">
          <Box
            h="50px"
            w="5px"
            display={["none", "block"]}
            bg={isMentioned ? "auditPanel.mentionRibbon" : "auditPanel.ribbon"}
            roundedRight="4px"
          >
            &nbsp;
          </Box>
          <Text fontSize="14px" fontWeight="700" ml="4" color="auditPanel.text">
            Office hazard assesment
          </Text>
        </Flex>
        <Flex>
          <Box p="3" w="100%" ml="3">
            <Text fontSize="12px" color="auditPanel.header">
              Location
            </Text>
            <Text fontSize="14px" color="auditPanel.text" noOfLines={2}>
              The Meridan Hospital
            </Text>
          </Box>
          <Box p="3" w="100%">
            <Text fontSize="12px" color="auditPanel.header">
              Type
            </Text>
            <Text fontSize="14px" color="auditPanel.text">
              Health & Safety
            </Text>
          </Box>
        </Flex>
        <Flex>
          <Box px="3" py="1" w="100%" ml="3">
            <Text fontSize="12px" color="auditPanel.header">
              Owner
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
          <Box px="3" py="1" w="100%">
            <Text fontSize="12px" color="auditPanel.header">
              Due for
            </Text>
            <Text fontSize="14px" color="auditPanel.text">
              24 August 2021
            </Text>
            <Text fontSize="14px" color="auditPanel.text">
              10:00 PM
            </Text>
          </Box>
        </Flex>
        <Flex>
          <Flex px="3" pt="4" w="100%" align="center" ml="3">
            <HealthKitIcon />
            <Text
              fontSize="14px"
              marginX="2"
              fontWeight="800"
              color="auditPanel.text"
            >
              0
            </Text>
            <Box position="relative">
              <MessageIcon mt="-4px" />
              {isMentioned ? (
                <AtTheRateIcon
                  position="absolute"
                  top="2px"
                  left="4px"
                  h="13px"
                />
              ) : (
                <RedDotIcon position="absolute" top="2px" left="4px" h="13px" />
              )}
            </Box>
          </Flex>
          <Box px="3" pt="4" w="100%">
            <Button
              bg="auditPanel.button"
              color="white"
              w="100px"
              h="30px"
              fontSize="14px"
              _focus={{ color: "white", bg: "black" }}
              _hover={{ color: "white", bg: "black" }}
              onClick={open}
            >
              More
            </Button>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default AuditPanel;
