import { Avatar, Box, Button, Flex, Icon, Text } from '@chakra-ui/react';

import { InvestigationWhiteIcon, MessageIcon, RedDotIcon } from '../icons';

function AccidentInvestigationPanel() {
  return (
    <Box
      borderRadius="lg"
      boxShadow="0px 4px 10px rgba(0, 0, 0, 0.05)"
      data-id="030925-5ab68f"
      h="312px"
      overflow="hidden"
      w="270px">
      <Flex
        alignItems="center"
        bg="investigationPanel.header"
        data-id="030925-7aa6cb"
        h="37px"
        px="4">
        <Icon as={InvestigationWhiteIcon} color="black" data-id="030925-afd72b" h="16px" />
        <Text
          color="investigationPanel.headerText"
          data-id="030925-bf91fd"
          fontSize="14px"
          fontWeight="400"
          pl="2">
          Accident Investigation
        </Text>
      </Flex>
      <Box
        bg="investigationPanel.bg"
        data-id="030925-2f9d22"
        h="100%"
        pt="3"
        w="100%">
        <Flex align="center" data-id="030925-4d4af2">
          <Box
            bg="investigationPanel.ribbon"
            data-id="030925-e82dce"
            display={['none', 'block']}
            h="50px"
            roundedRight="4px"
            w="5px">
            &nbsp;
          </Box>
          <Text
            color="investigationPanel.text"
            data-id="030925-f0e81b"
            fontSize="24px"
            fontWeight="700"
            ml="4">
            102
          </Text>
        </Flex>
        <Box data-id="030925-bd7a72" ml="3" p="3" w="100%">
          <Text color="investigationPanel.header" data-id="030925-567843" fontSize="12px">
            Site
          </Text>
          <Text color="investigationPanel.text" data-id="030925-82c19d" fontSize="14px">
            The Meridan Hospital
          </Text>
        </Box>
        <Flex data-id="030925-2e819e">
          <Box data-id="030925-cd5838" ml="3" px="3" py="4" w="100%">
            <Text color="investigationPanel.header" data-id="030925-a2a04f" fontSize="12px">
              Assigned to
            </Text>
            <Flex alignItems="center" data-id="030925-3448be">
              <Avatar
                bg="black"
                color="black"
                data-id="030925-1668ca"
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
            <Text color="investigationPanel.header" data-id="030925-87a565" fontSize="12px">
              Event date
            </Text>
            <Text color="investigationPanel.text" data-id="030925-2848f7" fontSize="14px">
              24 August 2021
            </Text>
            <Text color="investigationPanel.text" data-id="030925-5309c3" fontSize="14px">
              10:00 PM
            </Text>
          </Box>
        </Flex>
        <Flex data-id="030925-64b6c3">
          <Flex align="center" data-id="030925-f233e2" ml="3" p="3" w="100%">
            <Box data-id="030925-a21805" position="relative">
              <MessageIcon data-id="030925-7ee627" mt="-4px" />
              <RedDotIcon data-id="030925-950fcf" h="13px" left="4px" position="absolute" top="2px" />
            </Box>
          </Flex>
          <Box data-id="030925-33c02c" p="3" w="100%">
            <Button
              _focus={{ color: 'white', bg: 'black' }}
              _hover={{ color: 'white', bg: 'black' }}
              bg="investigationPanel.button"
              color="white"
              data-id="030925-eb0f02"
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
