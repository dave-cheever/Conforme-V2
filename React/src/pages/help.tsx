import { Flex, Text } from '@chakra-ui/react';

import Header from '../components/Header';

function Help() {
  return <Flex
    data-id="2760428c859f"
    flexDirection="column"
    h="full"
    overflow="auto"
    w="full">
    <Header
      breadcrumbs={['Home', 'Help']}
      data-id="8ce59d2a505b"
      mobileBreadcrumbs={['Help']} />
    <Flex
      bg="white"
      borderRadius="20px"
      data-id="e5c412ea5d51"
      flexDirection="column"
      h="full"
      maxWidth="full"
      mb={['25px', '25px']}
      ml="7"
      mr="25px"
      p="25px 30px 25px 30px">
      <Text data-id="8501153a5d0d" fontSize="14px" mb="30px">
        To be added.
      </Text>
    </Flex>
  </Flex>
}

export default Help;
