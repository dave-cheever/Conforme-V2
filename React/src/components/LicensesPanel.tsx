import React from 'react';

import { Box, Button, Flex, Icon, Text } from '@chakra-ui/react';

import { FileRightIcon, LicensesWhiteIcon, MessageIcon, RedDotIcon } from '../icons';

function LicensesPanel() {
  return (
    <Box
      data-id="030925-030d97"
      borderRadius="lg"
      boxShadow="0px 4px 10px rgba(0, 0, 0, 0.05)"
      h="312px"
      overflow="hidden"
      w="270px">
      <Flex
        data-id="030925-62a32e"
        alignItems="center"
        bg="licensesPanel.header"
        h="37px"
        px="4">
        <Icon data-id="030925-883d1a" as={LicensesWhiteIcon} color="black" h="16px" />
        <Text
          data-id="030925-a28f40"
          color="licensesPanel.headerText"
          fontSize="14px"
          fontWeight="400"
          pl="2">
          Licenses
        </Text>
      </Flex>
      <Box data-id="030925-f50aa7" bg="licensesPanel.bg" h="100%" pt="3" w="100%">
        <Flex data-id="030925-dc3e3c" align="center">
          <Box
            data-id="030925-4f7e5a"
            bg="licensesPanel.ribbon"
            display={['none', 'block']}
            h="50px"
            roundedRight="4px"
            w="5px">
            &nbsp;
          </Box>
          <Text
            data-id="030925-908412"
            color="licensesPanel.text"
            fontSize="14px"
            fontWeight="700"
            ml="4">
            Alcohol Premises License
          </Text>
        </Flex>
        <Box data-id="030925-a6d35e" ml="3" p="3" w="100%">
          <Text data-id="030925-2a4faf" color="licensesPanel.header" fontSize="12px">
            Location
          </Text>
          <Text data-id="030925-2e37e6" color="#313233" fontSize="14px">
            The Meridan Hospital
          </Text>
        </Box>
        <Flex data-id="030925-68a069">
          <Box data-id="030925-72382d" ml="3" px="3" py="6" w="100%">
            <Text data-id="030925-f99637" color="licensesPanel.header" fontSize="12px">
              Regulatory body
            </Text>
            <Flex data-id="030925-acb6c7" alignItems="center">
              <Text data-id="030925-38c004" fontSize="14px">Local authority</Text>
            </Flex>
          </Box>
          <Box data-id="030925-788c4e" px="3" py="6" w="100%">
            <Text data-id="030925-d324f2" color="licensesPanel.header" fontSize="12px">
              Next renewal on
            </Text>
            <Text data-id="030925-111ef4" color="#313233" fontSize="14px">
              13 August 2021
            </Text>
          </Box>
        </Flex>
        <Flex data-id="030925-46f2fc">
          <Flex data-id="030925-59c468" align="center" ml="3" pt="4" px="3" w="100%">
            <FileRightIcon data-id="030925-5ea307" />
            <Text
              data-id="030925-40feda"
              color="#313233"
              fontSize="14px"
              fontWeight="800"
              marginX="2">
              0
            </Text>
            <Box data-id="030925-09259c" position="relative">
              <MessageIcon data-id="030925-b8c805" mt="-4px" />
              <RedDotIcon data-id="030925-fa770e" h="13px" left="4px" position="absolute" top="2px" />
            </Box>
          </Flex>
          <Box data-id="030925-fe46e5" pt="4" px="3" w="100%">
            <Button
              data-id="030925-d8c280"
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
