import React from 'react';

import { Flex, Text } from '@chakra-ui/react';

const SummaryItem = ({ children, label }) => (
  <Flex data-id="6834375c9f61" flexDir="column">
    <Text
      color="summaryItemModal.label"
      data-id="b02d112a831b"
      fontSize="11px"
      fontWeight="bold"
      mb="5px">
      {label}
    </Text>
    <Text color="summaryItemModal.value" data-id="de10074f1062" fontSize="smm">
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
