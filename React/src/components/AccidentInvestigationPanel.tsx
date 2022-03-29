import { Avatar, Box, Button, Flex, Icon, Text } from '@chakra-ui/react';

import { InvestigationWhiteIcon, MessageIcon, RedDotIcon } from '../icons';

const AccidentInvestigationPanel = () => (
  <Box
    borderRadius="lg"
    boxShadow="0px 4px 10px rgba(0, 0, 0, 0.05)"
    h="312px"
    overflow="hidden"
    w="270px"
  >
    <Flex alignItems="center" bg="investigationPanel.header" h="37px" px="4">
      <Icon as={InvestigationWhiteIcon} color="black" h="16px" />
      <Text
        color="investigationPanel.headerText"
        fontSize="14px"
        fontWeight="400"
        pl="2"
      >
        Accident Investigation
      </Text>
    </Flex>
    <Box bg="investigationPanel.bg" h="100%" pt="3" w="100%">
      <Flex align="center">
        <Box
          bg="investigationPanel.ribbon"
          display={['none', 'block']}
          h="50px"
          roundedRight="4px"
          w="5px"
        >
          &nbsp;
        </Box>
        <Text
          color="investigationPanel.text"
          fontSize="24px"
          fontWeight="700"
          ml="4"
        >
          102
        </Text>
      </Flex>
      <Box ml="3" p="3" w="100%">
        <Text color="investigationPanel.header" fontSize="12px">
          Site
        </Text>
        <Text color="investigationPanel.text" fontSize="14px">
          The Meridan Hospital
        </Text>
      </Box>
      <Flex>
        <Box ml="3" px="3" py="4" w="100%">
          <Text color="investigationPanel.header" fontSize="12px">
            Assigned to
          </Text>
          <Flex alignItems="center">
            <Avatar
              bg="black"
              color="black"
              h="18px"
              mr={2}
              name=""
              rounded="full"
              size="sm"
              src=""
              w="18px"
            />
            <Text fontSize="14px">You</Text>
          </Flex>
        </Box>
        <Box px="3" py="4" w="100%">
          <Text color="investigationPanel.header" fontSize="12px">
            Event date
          </Text>
          <Text color="investigationPanel.text" fontSize="14px">
            24 August 2021
          </Text>
          <Text color="investigationPanel.text" fontSize="14px">
            10:00 PM
          </Text>
        </Box>
      </Flex>
      <Flex>
        <Flex align="center" ml="3" p="3" w="100%">
          <Box position="relative">
            <MessageIcon mt="-4px" />
            <RedDotIcon h="13px" left="4px" position="absolute" top="2px" />
          </Box>
        </Flex>
        <Box p="3" w="100%">
          <Button
            _focus={{ color: 'white', bg: 'black' }}
            _hover={{ color: 'white', bg: 'black' }}
            bg="investigationPanel.button"
            color="white"
            fontSize="14px"
            h="30px"
            w="100px"
          >
            Investigate
          </Button>
        </Box>
      </Flex>
    </Box>
  </Box>
);

export default AccidentInvestigationPanel;
