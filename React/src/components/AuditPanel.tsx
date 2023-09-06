import React from 'react';

import { Avatar, Box, Button, Flex, Icon, Spacer, Text } from '@chakra-ui/react';

import { AtTheRateIcon, AuditWhiteIcon, HealthKitIcon, MessageIcon, RedDotIcon } from '../icons';
import ProgressBar from './ProgressBar';

interface IAuditPanel {
  isMentioned?: boolean;
  open: () => void;
}

function AuditPanel({ isMentioned, open }: IAuditPanel) {
  return <Box
    borderRadius="lg"
    data-id="2802dd0905e3"
    h="312px"
    overflow="hidden"
    w="270px">
    <Flex
      alignItems="center"
      bg={isMentioned ? 'auditPanel.mentionHeader' : 'auditPanel.header'}
      data-id="7eca934b7bb4"
      h="37px"
      px="4">
      <Icon as={AuditWhiteIcon} color="black" data-id="0a36e3e34100" h="16px" />
      <Text
        color="auditPanel.headerText"
        data-id="a56a10337182"
        fontSize="14px"
        fontWeight="400"
        pl="2">
        Audit
      </Text>
      <Spacer data-id="452690a54f0e" />
      <Flex alignItems="center" data-id="538d43ece9cd" justifyContent="center">
        <ProgressBar data-id="04ef0d63af6f" value={0} />
        <Text color="auditPanel.headerText" data-id="2d59596dbac9" fontSize="12px">
          0%
        </Text>
      </Flex>
    </Flex>
    <Box bg="auditPanel.bg" data-id="31db8654b597" h="100%" pt="3" w="100%">
      <Flex align="center" data-id="7f5b2daacf25">
        <Box
          bg={isMentioned ? 'auditPanel.mentionRibbon' : 'auditPanel.ribbon'}
          data-id="72314b042222"
          display={['none', 'block']}
          h="50px"
          roundedRight="4px"
          w="5px">
          &nbsp;
        </Box>
        <Text
          color="auditPanel.text"
          data-id="25b4626b804f"
          fontSize="14px"
          fontWeight="700"
          ml="4">
          Office hazard assesment
        </Text>
      </Flex>
      <Flex data-id="a273cd18caa0">
        <Box data-id="c06f320952f8" ml="3" p="3" w="100%">
          <Text color="auditPanel.header" data-id="3cd696b9ea0a" fontSize="12px">
            Location
          </Text>
          <Text
            color="auditPanel.text"
            data-id="c99cecd53e38"
            fontSize="14px"
            noOfLines={2}>
            The Meridan Hospital
          </Text>
        </Box>
        <Box data-id="7eb03048cb31" p="3" w="100%">
          <Text color="auditPanel.header" data-id="d5499ce332d0" fontSize="12px">
            Type
          </Text>
          <Text color="auditPanel.text" data-id="00ce99d8de7d" fontSize="14px">
            Health & Safety
          </Text>
        </Box>
      </Flex>
      <Flex data-id="8bbf2e48e80a">
        <Box data-id="b248c292055e" ml="3" px="3" py="1" w="100%">
          <Text color="auditPanel.header" data-id="63349299beb7" fontSize="12px">
            Owner
          </Text>
          <Flex alignItems="center" data-id="9bbed6c7d14b">
            <Avatar
              bg="black"
              color="black"
              data-id="28541861a787"
              h="18px"
              mr={2}
              name=""
              rounded="full"
              size="sm"
              src=""
              w="18px" />
            <Text data-id="e3e94806c050" fontSize="14px">You</Text>
          </Flex>
        </Box>
        <Box data-id="88f765e55e91" px="3" py="1" w="100%">
          <Text color="auditPanel.header" data-id="b148df8a6f82" fontSize="12px">
            Due for
          </Text>
          <Text color="auditPanel.text" data-id="3f28457465ba" fontSize="14px">
            24 August 2021
          </Text>
          <Text color="auditPanel.text" data-id="71d1c9178be9" fontSize="14px">
            10:00 PM
          </Text>
        </Box>
      </Flex>
      <Flex data-id="b6d05c188d39">
        <Flex align="center" data-id="422d98f30003" ml="3" pt="4" px="3" w="100%">
          <HealthKitIcon data-id="440dd32bc9fd" stroke="auditPanel.healthKitIcon" />
          <Text
            color="auditPanel.text"
            data-id="e670b2d70ed7"
            fontSize="14px"
            fontWeight="800"
            marginX="2">
            0
          </Text>
          <Box data-id="5cd65d5fcb32" position="relative">
            <MessageIcon data-id="137b1d9a7fb6" mt="-4px" />
            {isMentioned ? (
              <AtTheRateIcon data-id="7345ce03ae66" h="13px" left="4px" position="absolute" top="2px" />
            ) : (
              <RedDotIcon data-id="79436de85f18" h="13px" left="4px" position="absolute" top="2px" />
            )}
          </Box>
        </Flex>
        <Box data-id="663eb929fee6" pt="4" px="3" w="100%">
          <Button
            _focus={{ color: 'white', bg: 'black' }}
            _hover={{ color: 'white', bg: 'black' }}
            bg="auditPanel.button"
            color="white"
            data-id="b5a0248a08cc"
            fontSize="14px"
            h="30px"
            onClick={open}
            w="100px">
            More
          </Button>
        </Box>
      </Flex>
    </Box>
  </Box>
}

export default AuditPanel;
