import { Avatar, Box, Button, Flex, Icon, Text } from '@chakra-ui/react';

import { InvestigationWhiteIcon, MessageIcon, RedDotIcon } from '../icons';

const AccidentInvestigationPanel = () => (
  <Box
    borderRadius="lg"
    boxShadow="0px 4px 10px rgba(0, 0, 0, 0.05)"
    data-id="c2c25105f3d0"
    h="312px"
    overflow="hidden"
    w="270px">
    <Flex
      alignItems="center"
      bg="investigationPanel.header"
      data-id="6377df760a6e"
      h="37px"
      px="4">
      <Icon as={InvestigationWhiteIcon} color="black" data-id="522a4dc74146" h="16px" />
      <Text
        color="investigationPanel.headerText"
        data-id="70e82f4cd103"
        fontSize="14px"
        fontWeight="400"
        pl="2">
        Accident Investigation
      </Text>
    </Flex>
    <Box
      bg="investigationPanel.bg"
      data-id="52f43c08c0b2"
      h="100%"
      pt="3"
      w="100%">
      <Flex align="center" data-id="bc644bba044b">
        <Box
          bg="investigationPanel.ribbon"
          data-id="a25049e0d888"
          display={['none', 'block']}
          h="50px"
          roundedRight="4px"
          w="5px">
          &nbsp;
        </Box>
        <Text
          color="investigationPanel.text"
          data-id="901751ee655f"
          fontSize="24px"
          fontWeight="700"
          ml="4">
          102
        </Text>
      </Flex>
      <Box data-id="edaf7fb44cc3" ml="3" p="3" w="100%">
        <Text color="investigationPanel.header" data-id="dacf558301b9" fontSize="12px">
          Site
        </Text>
        <Text color="investigationPanel.text" data-id="0e11ae508571" fontSize="14px">
          The Meridan Hospital
        </Text>
      </Box>
      <Flex data-id="c8feeaffdaef">
        <Box data-id="8d6c0e7d645e" ml="3" px="3" py="4" w="100%">
          <Text color="investigationPanel.header" data-id="388add2f5335" fontSize="12px">
            Assigned to
          </Text>
          <Flex alignItems="center" data-id="f20916164762">
            <Avatar
              bg="black"
              color="black"
              data-id="f7c36b99a6a8"
              h="18px"
              mr={2}
              name=""
              rounded="full"
              size="sm"
              src=""
              w="18px" />
            <Text data-id="e00ec5ebe51c" fontSize="14px">You</Text>
          </Flex>
        </Box>
        <Box data-id="2fd4351f32d9" px="3" py="4" w="100%">
          <Text color="investigationPanel.header" data-id="cf594f5dfd33" fontSize="12px">
            Event date
          </Text>
          <Text color="investigationPanel.text" data-id="4293efe44e6c" fontSize="14px">
            24 August 2021
          </Text>
          <Text color="investigationPanel.text" data-id="bf62692d6a8a" fontSize="14px">
            10:00 PM
          </Text>
        </Box>
      </Flex>
      <Flex data-id="620abff90cfe">
        <Flex align="center" data-id="59dad4f3fb49" ml="3" p="3" w="100%">
          <Box data-id="f111ea0b81c9" position="relative">
            <MessageIcon data-id="b85edc035f9b" mt="-4px" />
            <RedDotIcon data-id="081e0d14fb09" h="13px" left="4px" position="absolute" top="2px" />
          </Box>
        </Flex>
        <Box data-id="e54213bffaac" p="3" w="100%">
          <Button
            _focus={{ color: 'white', bg: 'black' }}
            _hover={{ color: 'white', bg: 'black' }}
            bg="investigationPanel.button"
            color="white"
            data-id="1b5352972a84"
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

export default AccidentInvestigationPanel;
