import { Avatar, Box, Button, Flex, Icon, Text } from '@chakra-ui/react';

import { InvestigationWhiteIcon, MessageIcon, RedDotIcon } from '../icons';

function AccidentInvestigationPanel() {
  return (
    <Box
      data-id="030925-5ab68f"
      borderRadius="lg"
      boxShadow="0px 4px 10px rgba(0, 0, 0, 0.05)"
      h="312px"
      overflow="hidden"
      w="270px">
      <Flex
        data-id="030925-7aa6cb"
        alignItems="center"
        bg="investigationPanel.header"
        h="37px"
        px="4">
        <Icon data-id="030925-afd72b" as={InvestigationWhiteIcon} color="black" h="16px" />
        <Text
          data-id="030925-bf91fd"
          color="investigationPanel.headerText"
          fontSize="14px"
          fontWeight="400"
          pl="2">
          Accident Investigation
        </Text>
      </Flex>
      <Box
        data-id="030925-2f9d22"
        bg="investigationPanel.bg"
        h="100%"
        pt="3"
        w="100%">
        <Flex data-id="030925-4d4af2" align="center">
          <Box
            data-id="030925-e82dce"
            bg="investigationPanel.ribbon"
            display={['none', 'block']}
            h="50px"
            roundedRight="4px"
            w="5px">
            &nbsp;
          </Box>
          <Text
            data-id="030925-f0e81b"
            color="investigationPanel.text"
            fontSize="24px"
            fontWeight="700"
            ml="4">
            102
          </Text>
        </Flex>
        <Box data-id="030925-bd7a72" ml="3" p="3" w="100%">
          <Text data-id="030925-567843" color="investigationPanel.header" fontSize="12px">
            Site
          </Text>
          <Text data-id="030925-82c19d" color="investigationPanel.text" fontSize="14px">
            The Meridan Hospital
          </Text>
        </Box>
        <Flex data-id="030925-2e819e">
          <Box data-id="030925-cd5838" ml="3" px="3" py="4" w="100%">
            <Text data-id="030925-a2a04f" color="investigationPanel.header" fontSize="12px">
              Assigned to
            </Text>
            <Flex data-id="030925-3448be" alignItems="center">
              <Avatar
                data-id="030925-1668ca"
                bg="black"
                color="black"
                h="18px"
                mr={2}
                name=""
                rounded="full"
                size="sm"
                src=""
                w="18px" />
              <Text data-id="030925-869695" fontSize="14px">You</Text>
            </Flex>
          </Box>
          <Box data-id="030925-ed7966" px="3" py="4" w="100%">
            <Text data-id="030925-87a565" color="investigationPanel.header" fontSize="12px">
              Event date
            </Text>
            <Text data-id="030925-2848f7" color="investigationPanel.text" fontSize="14px">
              24 August 2021
            </Text>
            <Text data-id="030925-5309c3" color="investigationPanel.text" fontSize="14px">
              10:00 PM
            </Text>
          </Box>
        </Flex>
        <Flex data-id="030925-64b6c3">
          <Flex data-id="030925-f233e2" align="center" ml="3" p="3" w="100%">
            <Box data-id="030925-a21805" position="relative">
              <MessageIcon data-id="030925-7ee627" mt="-4px" />
              <RedDotIcon data-id="030925-950fcf" h="13px" left="4px" position="absolute" top="2px" />
            </Box>
          </Flex>
          <Box data-id="030925-33c02c" p="3" w="100%">
            <Button
              data-id="030925-eb0f02"
              _focus={{ color: 'white', bg: 'black' }}
              _hover={{ color: 'white', bg: 'black' }}
              bg="investigationPanel.button"
              color="white"
              fontSize="14px"
              h="30px"
              w="100px">
              Investigate
            </Button>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

export default AccidentInvestigationPanel;
