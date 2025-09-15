import React from 'react';

import { Flex } from '@chakra-ui/react';

function TabItem({ label, setActiveTab, active, index }) {
  const onClick = () => {
    setActiveTab(index);
  };

  return (
    <Flex
        _hover={{
          color: active ? 'settingsTabItem.activeColor' : 'settingsTabItem.hoverColor',
        }}
        align="center"
        bg={active ? 'settingsTabItem.activeBg' : 'settingsTabItem.bg'}
        borderRadius="10px"
        color={active ? 'settingsTabItem.activeColor' : 'settingsTabItem.color'}
        cursor="pointer"
        data-id="030925-ed34bf"
        fontSize='14px'
        fontWeight="700"
        h={['fit-content', '30px']}
        mr={[1, 3]}
        onClick={onClick}
        px="10px"
        py={['4px', '0px']}
        textOverflow="ellipsis"
        whiteSpace="nowrap">
      {label}
    </Flex>
  );
}

export default TabItem;

export const settingsTabItemStyles = {
  settingsTabItem: {
    activeBg: '#462AC4',
    bg: 'white',
    activeColor: 'white',
    color: '#818197',
    hoverColor: '#282F36',
    tabItemBg: '#F0F0F0',
  },
};
