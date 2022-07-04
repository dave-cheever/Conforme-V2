import { Flex, Text } from '@chakra-ui/react';

import Header from '../components/Header';

const Help = () => (
  <Flex flexDirection="column" h="full" overflow="auto" w="full">
    <Header breadcrumbs={['Home', 'Help']} mobileBreadcrumbs={['Help']} />
    <Flex
      bg="white"
      borderRadius="20px"
      flexDirection="column"
      h="full"
      maxWidth="full"
      mb={['25px', '25px']}
      ml="7"
      mr="25px"
      p="25px 30px 25px 30px"
    >
      <Text fontSize="14px" mb="30px">
        To be added.
      </Text>
    </Flex>
  </Flex>
);

export default Help;
