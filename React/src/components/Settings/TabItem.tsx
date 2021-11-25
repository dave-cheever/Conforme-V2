import React from 'react';
import { Flex } from '@chakra-ui/react';

const TabItem = ({label,setActiveTab, active, index}) => {

    const onClick = () => {
        setActiveTab(index);
    }

    return (
      <Flex 
        mr={3} fontSize="14px" 
        p="3" h="30px" borderRadius="10px" 
        bg={active ? "settingsTabItem.activeBg" : "settingsTabItem.bg"}
        align="center" 
        color={active ? "settingsTabItem.activeColor" : "settingsTabItem.color"}
        cursor="pointer"
        _hover={{ color: active ? "settingsTabItem.activeColor": "settingsTabItem.hoverColor"}}
        onClick={onClick}
        fontWeight="700"
      >
        {label} 
      </Flex>
    );
}

export default TabItem;

export const settingsTabItemStyles = {
    settingsTabItem:{
        activeBg: "#282F36",
        bg: "white",
        activeColor: "white", 
        color: "#818197",
        hoverColor: "#282F36"
    }
}