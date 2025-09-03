import React from 'react';

import { Flex, Icon, Text } from '@chakra-ui/react';

function ResponseTabItem({ setActiveTab, index, active, label, icon }) {
  const onClick = () => {
    setActiveTab(index);
  };

  return (
    <Flex
        data-id="030925-107c1f"
        _hover={{ bg: 'responseTabItem.activeBg' }}
        align="center"
        bg={active ? 'responseTabItem.activeBg' : 'responseTabItem.bg'}
        borderRadius="10px"
        color={active ? 'responseTabItem.activeColor' : 'responseTabItem.color'}
        cursor="pointer"
        flexDirection="column"
        h="62px"
        onClick={onClick}
        p="8px 13px 6px 13px">
      <Icon data-id="030925-d536e5" as={icon} boxSize="15px" />
      <Text
        data-id="030925-19e87e"
        fontSize={['11px', '14px']}
        fontWeight="700"
        mt={3}>
        {label}
      </Text>
    </Flex>
  );
}

export default ResponseTabItem;

export const responseTabItemStyles = {
  responseTabItem: {
    bg: 'white',
    activeBg: '#F0F2F5',
    color: '#818197',
    activeColor: '#282F36',
  },
};
