import React from 'react';

import { Box, Button, Flex, Icon, Text } from '@chakra-ui/react';

import { FileRightIcon, LicensesWhiteIcon, MessageIcon, RedDotIcon } from '../icons';

function LicensesPanel() {
  return (
    <Box
      data-id="000297"
      borderRadius="lg"
      boxShadow="0px 4px 10px rgba(0, 0, 0, 0.05)"
      h="312px"
      overflow="hidden"
      w="270px">
      <Flex
        data-id="000298"
        alignItems="center"
        bg="licensesPanel.header"
        h="37px"
        px="4">
        <Icon data-id="000299" as={LicensesWhiteIcon} color="black" h="16px" />
        <Text
          data-id="000300"
          color="licensesPanel.headerText"
          fontSize="14px"
          fontWeight="400"
          pl="2">
          Licenses
        </Text>
      </Flex>
      <Box data-id="000301" bg="licensesPanel.bg" h="100%" pt="3" w="100%">
        <Flex data-id="000302" align="center">
          <Box
            data-id="000303"
            bg="licensesPanel.ribbon"
            display={['none', 'block']}
            h="50px"
            roundedRight="4px"
            w="5px">
            &nbsp;
          </Box>
          <Text
            data-id="000304"
            color="licensesPanel.text"
            fontSize="14px"
            fontWeight="700"
            ml="4">
            Alcohol Premises License
          </Text>
        </Flex>
        <Box data-id="000305" ml="3" p="3" w="100%">
          <Text data-id="000306" color="licensesPanel.header" fontSize="12px">
            Location
          </Text>
          <Text data-id="000307" color="#313233" fontSize="14px">
            The Meridan Hospital
          </Text>
        </Box>
        <Flex data-id="000308">
          <Box data-id="000309" ml="3" px="3" py="6" w="100%">
            <Text data-id="000310" color="licensesPanel.header" fontSize="12px">
              Regulatory body
            </Text>
            <Flex data-id="000311" alignItems="center">
              <Text data-id="000312" fontSize="14px">Local authority</Text>
            </Flex>
          </Box>
          <Box data-id="000313" px="3" py="6" w="100%">
            <Text data-id="000314" color="licensesPanel.header" fontSize="12px">
              Next renewal on
            </Text>
            <Text data-id="000315" color="#313233" fontSize="14px">
              13 August 2021
            </Text>
          </Box>
        </Flex>
        <Flex data-id="000316">
          <Flex data-id="000317" align="center" ml="3" pt="4" px="3" w="100%">
            <FileRightIcon data-id="000318" />
            <Text
              data-id="000319"
              color="#313233"
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
              data-id="000324"
              _focus={{ color: 'white', bg: 'black' }}
              _hover={{ color: 'white', bg: 'black' }}
              bg="licensesPanel.button"
              color="white"
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
