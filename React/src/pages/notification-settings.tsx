import { Flex, Text } from '@chakra-ui/react';

import Header from '../components/Header';

function NotificationSettings() {
  return (
    <Flex data-id="000280" flexDirection="column" h="full" overflow="auto" w="full">
      <Header breadcrumbs={['Home', 'Notification Settings']} data-id="000281" mobileBreadcrumbs={['Notification Settings']} />
      <Flex
        bg="white"
        borderRadius="20px"
        data-id="000282"
        flexDirection="column"
        h="auto"
        maxWidth="full"
        mb={['25px', '25px']}
        ml="7"
        mr="25px"
        p="25px 30px"
      >
        <div data-id="000284">
          <Text data-id="000287" fontSize="14px" mb="30px">
            No Settings Found
          </Text>
        </div>
      </Flex>
    </Flex>
  );
}

export default NotificationSettings;
