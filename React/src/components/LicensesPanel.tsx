import React from 'react';

import { Box, Button, Flex, Icon, Text } from '@chakra-ui/react';

import {
  FileRightIcon,
  LicensesWhiteIcon,
  MessageIcon,
  RedDotIcon,
} from '../icons';

const LicensesPanel = () => (
  <Box
    borderRadius="lg"
    boxShadow="0px 4px 10px rgba(0, 0, 0, 0.05)"
    h="312px"
    overflow="hidden"
    w="270px"
  >
    <Flex alignItems="center" bg="licensesPanel.header" h="37px" px="4">
      <Icon as={LicensesWhiteIcon} color="black" h="16px" />
      <Text
        color="licensesPanel.headerText"
        fontSize="14px"
        fontWeight="400"
        pl="2"
      >
        Licenses
      </Text>
    </Flex>
    <Box bg="licensesPanel.bg" h="100%" pt="3" w="100%">
      <Flex align="center">
        <Box
          bg="licensesPanel.ribbon"
          display={['none', 'block']}
          h="50px"
          roundedRight="4px"
          w="5px"
        >
          &nbsp;
        </Box>
        <Text
          color="licensesPanel.text"
          fontSize="14px"
          fontWeight="700"
          ml="4"
        >
          Alcohol Premises License
        </Text>
      </Flex>
      <Box ml="3" p="3" w="100%">
        <Text color="licensesPanel.header" fontSize="12px">
          Location
        </Text>
        <Text color="#313233" fontSize="14px">
          The Meridan Hospital
        </Text>
      </Box>
      <Flex>
        <Box ml="3" px="3" py="6" w="100%">
          <Text color="licensesPanel.header" fontSize="12px">
            Regulatory body
          </Text>
          <Flex alignItems="center">
            <Text fontSize="14px">Local authority</Text>
          </Flex>
        </Box>
        <Box px="3" py="6" w="100%">
          <Text color="licensesPanel.header" fontSize="12px">
            Next renewal on
          </Text>
          <Text color="#313233" fontSize="14px">
            13 August 2021
          </Text>
        </Box>
      </Flex>
      <Flex>
        <Flex align="center" ml="3" pt="4" px="3" w="100%">
          <FileRightIcon />
          <Text color="#313233" fontSize="14px" fontWeight="800" marginX="2">
            0
          </Text>
          <Box position="relative">
            <MessageIcon mt="-4px" />
            <RedDotIcon h="13px" left="4px" position="absolute" top="2px" />
          </Box>
        </Flex>
        <Box pt="4" px="3" w="100%">
          <Button
            _focus={{ color: 'white', bg: 'black' }}
            _hover={{ color: 'white', bg: 'black' }}
            bg="licensesPanel.button"
            color="white"
            fontSize="14px"
            h="30px"
            w="100px"
          >
            View
          </Button>
        </Box>
      </Flex>
    </Box>
  </Box>
);

export default LicensesPanel;
