import React from 'react';

import { Flex, Icon, Text } from '@chakra-ui/react';

const ResponseTabItem = ({ setActiveTab, index, active, label, icon }) => {
  const onClick = () => {
    setActiveTab(index);
  };

  return (
    <Flex
      _hover={{ bg: 'responseTabItem.activeBg' }}
      align="center"
      bg={active ? 'responseTabItem.activeBg' : 'responseTabItem.bg'}
      borderRadius="10px"
      color={active ? 'responseTabItem.activeColor' : 'responseTabItem.color'}
      cursor="pointer"
      flexDirection="column"
      h="62px"
      onClick={onClick}
      p="8px 13px 6px 13px"
    >
      <Icon as={icon} boxSize="15px" />
      <Text fontSize={['11px', '14px']} fontWeight="700" mt={3}>
        {label}
      </Text>
    </Flex>
  );
};

export default ResponseTabItem;

export const responseTabItemStyles = {
  responseTabItem: {
    bg: 'white',
    activeBg: '#F0F2F5',
    color: '#818197',
    activeColor: '#282F36',
  },
};
