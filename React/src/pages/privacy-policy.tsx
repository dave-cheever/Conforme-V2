import React from 'react';

import { Flex, Text } from '@chakra-ui/react';

import Header from '../components/Header';

const PrivacyPolicy = () => (
  <Flex direction="column" h="full" w="full">
    <Header
      breadcrumbs={['Home', 'Privacy policy']}
      mobileBreadcrumbs={['Privacy policy']}
    />
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
      <Text fontSize="24px" fontWeight="bold" mb="30px">
        Privacy Policy
      </Text>
      <Text>Lorem ipsum</Text>
    </Flex>
  </Flex>
);

export default PrivacyPolicy;
