import React from 'react';

import { Box, Button, Flex, Icon, Text } from '@chakra-ui/react';

import { FileRightIcon, LicensesWhiteIcon, MessageIcon, RedDotIcon } from '../icons';

function LicensesPanel() {
  return <Box
    borderRadius="lg"
    boxShadow="0px 4px 10px rgba(0, 0, 0, 0.05)"
    data-id="da32d5e701bd"
    h="312px"
    overflow="hidden"
    w="270px">
    <Flex
      alignItems="center"
      bg="licensesPanel.header"
      data-id="e5f292d45e2f"
      h="37px"
      px="4">
      <Icon as={LicensesWhiteIcon} color="black" data-id="275e9b08ad6a" h="16px" />
      <Text
        color="licensesPanel.headerText"
        data-id="208265a97989"
        fontSize="14px"
        fontWeight="400"
        pl="2">
        Licenses
      </Text>
    </Flex>
    <Box bg="licensesPanel.bg" data-id="fd2059691462" h="100%" pt="3" w="100%">
      <Flex align="center" data-id="9f66d8664272">
        <Box
          bg="licensesPanel.ribbon"
          data-id="bd813a746494"
          display={['none', 'block']}
          h="50px"
          roundedRight="4px"
          w="5px">
          &nbsp;
        </Box>
        <Text
          color="licensesPanel.text"
          data-id="7c6fe690cb6b"
          fontSize="14px"
          fontWeight="700"
          ml="4">
          Alcohol Premises License
        </Text>
      </Flex>
      <Box data-id="7bea9b47d30d" ml="3" p="3" w="100%">
        <Text color="licensesPanel.header" data-id="3ca6b72d9b86" fontSize="12px">
          Location
        </Text>
        <Text color="#313233" data-id="911fcd23f5a2" fontSize="14px">
          The Meridan Hospital
        </Text>
      </Box>
      <Flex data-id="6200f4b9e0a1">
        <Box data-id="a4aef89f731c" ml="3" px="3" py="6" w="100%">
          <Text color="licensesPanel.header" data-id="f486c70d5237" fontSize="12px">
            Regulatory body
          </Text>
          <Flex alignItems="center" data-id="be4e06e89df3">
            <Text data-id="2d91653c7e50" fontSize="14px">Local authority</Text>
          </Flex>
        </Box>
        <Box data-id="a5dd269b82b0" px="3" py="6" w="100%">
          <Text color="licensesPanel.header" data-id="54de72ebcc31" fontSize="12px">
            Next renewal on
          </Text>
          <Text color="#313233" data-id="8643032a1847" fontSize="14px">
            13 August 2021
          </Text>
        </Box>
      </Flex>
      <Flex data-id="b946d7ffd37a">
        <Flex align="center" data-id="41431dd30a68" ml="3" pt="4" px="3" w="100%">
          <FileRightIcon data-id="12d15d9302b9" />
          <Text
            color="#313233"
            data-id="7ff7abc84217"
            fontSize="14px"
            fontWeight="800"
            marginX="2">
            0
          </Text>
          <Box data-id="30a77dfe2989" position="relative">
            <MessageIcon data-id="f37f36ef0c48" mt="-4px" />
            <RedDotIcon data-id="1b5e9515274e" h="13px" left="4px" position="absolute" top="2px" />
          </Box>
        </Flex>
        <Box data-id="d32b615c5505" pt="4" px="3" w="100%">
          <Button
            _focus={{ color: 'white', bg: 'black' }}
            _hover={{ color: 'white', bg: 'black' }}
            bg="licensesPanel.button"
            color="white"
            data-id="75e77bfbc682"
            fontSize="14px"
            h="30px"
            w="100px">
            View
          </Button>
        </Box>
      </Flex>
    </Box>
  </Box>
}

export default LicensesPanel;
