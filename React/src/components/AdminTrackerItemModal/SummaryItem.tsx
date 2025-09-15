import React from 'react';

import { Flex, Text } from '@chakra-ui/react';

function SummaryItem({ children, label }) {
  return (
    <Flex data-id="030925-23a0e4" flexDir="column">
      <Text
        color="summaryItemModal.label"
        data-id="030925-85c866"
        fontSize="11px"
        fontWeight="bold"
        mb="5px">
        {label}
      </Text>
      <Text color="summaryItemModal.value" data-id="030925-eb3fc1" fontSize="smm">
        {children}
      </Text>
    </Flex>
  );
}

export default SummaryItem;

export const summaryItemModalStyles = {
  summaryItemModal: {
    label: '#282F36',
    value: '#2B3236',
  },
};
