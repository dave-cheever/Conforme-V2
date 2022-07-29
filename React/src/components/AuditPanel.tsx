import React from 'react';

import { Avatar, Box, Button, Flex, Icon, Spacer, Text } from '@chakra-ui/react';

import { AtTheRateIcon, AuditWhiteIcon, HealthKitIcon, MessageIcon, RedDotIcon } from '../icons';
import ProgressBar from './ProgressBar';

interface IAuditPanel {
  isMentioned?: boolean;
  open: () => void;
}

const AuditPanel = ({ isMentioned, open }: IAuditPanel) => (
  <Box borderRadius="lg" h="312px" overflow="hidden" w="270px">
    <Flex alignItems="center" bg={isMentioned ? 'auditPanel.mentionHeader' : 'auditPanel.header'} h="37px" px="4">
      <Icon as={AuditWhiteIcon} color="black" h="16px" />
      <Text color="auditPanel.headerText" fontSize="14px" fontWeight="400" pl="2">
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
    <Box bg="auditPanel.bg" h="100%" pt="3" w="100%">
      <Flex align="center">
        <Box
          bg={isMentioned ? 'auditPanel.mentionRibbon' : 'auditPanel.ribbon'}
          display={['none', 'block']}
          h="50px"
          roundedRight="4px"
          w="5px"
        >
          &nbsp;
        </Box>
        <Text color="auditPanel.text" fontSize="14px" fontWeight="700" ml="4">
          Office hazard assesment
        </Text>
      </Flex>
      <Flex>
        <Box ml="3" p="3" w="100%">
          <Text color="auditPanel.header" fontSize="12px">
            Location
          </Text>
          <Text color="auditPanel.text" fontSize="14px" noOfLines={2}>
            The Meridan Hospital
          </Text>
        </Box>
        <Box p="3" w="100%">
          <Text color="auditPanel.header" fontSize="12px">
            Type
          </Text>
          <Text color="auditPanel.text" fontSize="14px">
            Health & Safety
          </Text>
        </Box>
      </Flex>
      <Flex>
        <Box ml="3" px="3" py="1" w="100%">
          <Text color="auditPanel.header" fontSize="12px">
            Owner
          </Text>
          <Flex alignItems="center">
            <Avatar bg="black" color="black" h="18px" mr={2} name="" rounded="full" size="sm" src="" w="18px" />
            <Text fontSize="14px">You</Text>
          </Flex>
        </Box>
        <Box px="3" py="1" w="100%">
          <Text color="auditPanel.header" fontSize="12px">
            Due for
          </Text>
          <Text color="auditPanel.text" fontSize="14px">
            24 August 2021
          </Text>
          <Text color="auditPanel.text" fontSize="14px">
            10:00 PM
          </Text>
        </Box>
      </Flex>
      <Flex>
        <Flex align="center" ml="3" pt="4" px="3" w="100%">
          <HealthKitIcon stroke="auditPanel.healthKitIcon" />
          <Text color="auditPanel.text" fontSize="14px" fontWeight="800" marginX="2">
            0
          </Text>
          <Box position="relative">
            <MessageIcon mt="-4px" />
            {isMentioned ? (
              <AtTheRateIcon h="13px" left="4px" position="absolute" top="2px" />
            ) : (
              <RedDotIcon h="13px" left="4px" position="absolute" top="2px" />
            )}
          </Box>
        </Flex>
        <Box pt="4" px="3" w="100%">
          <Button
            _focus={{ color: 'white', bg: 'black' }}
            _hover={{ color: 'white', bg: 'black' }}
            bg="auditPanel.button"
            color="white"
            fontSize="14px"
            h="30px"
            onClick={open}
            w="100px"
          >
            More
          </Button>
        </Box>
      </Flex>
    </Box>
  </Box>
);

export default AuditPanel;
