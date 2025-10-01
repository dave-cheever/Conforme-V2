import React from 'react';

import { Box, Button, Flex, Icon, Text } from '@chakra-ui/react';

import { FileRightIcon, LicensesWhiteIcon, MessageIcon, RedDotIcon } from '../icons';

function LicensesPanel() {
  return (
    <Box
      borderRadius="lg"
      boxShadow="0px 4px 10px rgba(0, 0, 0, 0.05)"
      data-id="000297"
      h="312px"
      overflow="hidden"
      w="270px">
      <Flex
        alignItems="center"
        bg="licensesPanel.header"
        data-id="000298"
        h="37px"
        px="4">
        <Icon as={LicensesWhiteIcon} color="black" data-id="000299" h="16px" />
        <Text
          color="licensesPanel.headerText"
          data-id="000300"
          fontSize="14px"
          fontWeight="400"
          pl="2">
          Licenses
        </Text>
      </Flex>
      <Box bg="licensesPanel.bg" data-id="000301" h="100%" pt="3" w="100%">
        <Flex align="center" data-id="000302">
          <Box
            bg="licensesPanel.ribbon"
            data-id="000303"
            display={['none', 'block']}
            h="50px"
            roundedRight="4px"
            w="5px">
            &nbsp;
          </Box>
          <Text
            color="licensesPanel.text"
            data-id="000304"
            fontSize="14px"
            fontWeight="700"
            ml="4">
            Alcohol Premises License
          </Text>
        </Flex>
        <Box data-id="000305" ml="3" p="3" w="100%">
          <Text color="licensesPanel.header" data-id="000306" fontSize="12px">
            Location
          </Text>
          <Text color="#313233" data-id="000307" fontSize="14px">
            The Meridan Hospital
          </Text>
        </Box>
        <Flex data-id="000308">
          <Box data-id="000309" ml="3" px="3" py="6" w="100%">
            <Text color="licensesPanel.header" data-id="000310" fontSize="12px">
              Regulatory body
            </Text>
            <Flex alignItems="center" data-id="000311">
              <Text data-id="000312" fontSize="14px">Local authority</Text>
            </Flex>
          </Box>
          <Box data-id="000313" px="3" py="6" w="100%">
            <Text color="licensesPanel.header" data-id="000314" fontSize="12px">
              Next renewal on
            </Text>
            <Text color="#313233" data-id="000315" fontSize="14px">
              13 August 2021
            </Text>
          </Box>
        </Flex>
        <Flex data-id="000316">
          <Flex align="center" data-id="000317" ml="3" pt="4" px="3" w="100%">
            <FileRightIcon data-id="000318" />
            <Text
              color="#313233"
              data-id="000319"
              fontSize="14px"
              fontWeight="800"
              marginX="2">
              0
            </Text>
            <Box data-id="000320" position="relative">
              <MessageIcon data-id="000321" mt="-4px" />
              <RedDotIcon data-id="000322" h="13px" left="4px" position="absolute" top="2px" />
            </Box>
          </Flex>
          <Box data-id="000323" pt="4" px="3" w="100%">
            <Button
              _focus={{ color: 'white', bg: 'black' }}
              _hover={{ color: 'white', bg: 'black' }}
              bg="licensesPanel.button"
              color="white"
              data-id="000324"
              fontSize="14px"
              h="30px"
              w="100px">
              View
            </Button>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

export default LicensesPanel;
