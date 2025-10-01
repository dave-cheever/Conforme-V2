import { Avatar, Box, Button, Flex, Icon, Text } from '@chakra-ui/react';

import { InvestigationWhiteIcon, MessageIcon, RedDotIcon } from '../icons';

function AccidentInvestigationPanel() {
  return (
    <Box
      borderRadius="lg"
      boxShadow="0px 4px 10px rgba(0, 0, 0, 0.05)"
      data-id="000110"
      h="312px"
      overflow="hidden"
      w="270px">
      <Flex
        alignItems="center"
        bg="investigationPanel.header"
        data-id="000111"
        h="37px"
        px="4">
        <Icon as={InvestigationWhiteIcon} color="black" data-id="000112" h="16px" />
        <Text
          color="investigationPanel.headerText"
          data-id="000113"
          fontSize="14px"
          fontWeight="400"
          pl="2">
          Accident Investigation
        </Text>
      </Flex>
      <Box
        bg="investigationPanel.bg"
        data-id="000114"
        h="100%"
        pt="3"
        w="100%">
        <Flex align="center" data-id="000115">
          <Box
            bg="investigationPanel.ribbon"
            data-id="000116"
            display={['none', 'block']}
            h="50px"
            roundedRight="4px"
            w="5px">
            &nbsp;
          </Box>
          <Text
            color="investigationPanel.text"
            data-id="000117"
            fontSize="24px"
            fontWeight="700"
            ml="4">
            102
          </Text>
        </Flex>
        <Box data-id="000118" ml="3" p="3" w="100%">
          <Text color="investigationPanel.header" data-id="000119" fontSize="12px">
            Site
          </Text>
          <Text color="investigationPanel.text" data-id="000120" fontSize="14px">
            The Meridan Hospital
          </Text>
        </Box>
        <Flex data-id="000121">
          <Box data-id="000122" ml="3" px="3" py="4" w="100%">
            <Text color="investigationPanel.header" data-id="000123" fontSize="12px">
              Assigned to
            </Text>
            <Flex alignItems="center" data-id="000124">
              <Avatar
                bg="black"
                color="black"
                data-id="000125"
                h="18px"
                mr={2}
                name=""
                rounded="full"
                size="sm"
                src=""
                w="18px" />
              <Text data-id="000126" fontSize="14px">You</Text>
            </Flex>
          </Box>
          <Box data-id="000127" px="3" py="4" w="100%">
            <Text color="investigationPanel.header" data-id="000128" fontSize="12px">
              Event date
            </Text>
            <Text color="investigationPanel.text" data-id="000129" fontSize="14px">
              24 August 2021
            </Text>
            <Text color="investigationPanel.text" data-id="000130" fontSize="14px">
              10:00 PM
            </Text>
          </Box>
        </Flex>
        <Flex data-id="000131">
          <Flex align="center" data-id="000132" ml="3" p="3" w="100%">
            <Box data-id="000133" position="relative">
              <MessageIcon data-id="000134" mt="-4px" />
              <RedDotIcon data-id="000135" h="13px" left="4px" position="absolute" top="2px" />
            </Box>
          </Flex>
          <Box data-id="000136" p="3" w="100%">
            <Button
              _focus={{ color: 'white', bg: 'black' }}
              _hover={{ color: 'white', bg: 'black' }}
              bg="investigationPanel.button"
              color="white"
              data-id="000137"
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
