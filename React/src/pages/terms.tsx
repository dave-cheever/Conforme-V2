import React from 'react';

import { Flex, Text } from '@chakra-ui/react';

import Header from '../components/Header';

const Terms = () => (
  <Flex direction="column" h="full" w="full">
    <Header breadcrumbs={['Home', 'Terms and conditions']} mobileBreadcrumbs={['Terms and conditions']} />
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

export default Terms;
