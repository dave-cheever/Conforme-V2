import React from 'react';

import { Flex, Text } from '@chakra-ui/react';

const SummaryItem = ({ children, label }) => (
  <Flex flexDir="column">
    <Text color="summaryItemModal.label" fontSize="11px" fontWeight="bold" mb="5px">
      {label}
    </Text>
    <Text color="summaryItemModal.value" fontSize="smm">
      {children}
    </Text>
  </Flex>
);

export default SummaryItem;

export const summaryItemModalStyles = {
  summaryItemModal: {
    label: '#282F36',
    value: '#2B3236',
  },
};
