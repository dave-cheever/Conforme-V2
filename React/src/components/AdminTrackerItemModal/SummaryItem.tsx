import React from 'react';

import { Flex, Text } from '@chakra-ui/react';

function SummaryItem({ children, label }) {
  return (
    <Flex data-id="000653" flexDir="column">
      <Text
        data-id="000654"
        color="summaryItemModal.label"
        fontSize="11px"
        fontWeight="bold"
        mb="5px">
        {label}
      </Text>
      <Text data-id="000655" color="summaryItemModal.value" fontSize="smm">
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
