import React from 'react'
import { Flex, Text, Icon } from '@chakra-ui/react'

const ResponseTabItem = ({setActiveTab, index,active, label, icon}) => {

  const onClick = () => {
    setActiveTab(index);
  }

  return (
    <Flex 
        onClick={onClick}
        flexDirection="column"
        h="62px" p="8px 13px 6px 13px" borderRadius="10px" 
        bg={active ? "responseTabItem.activeBg": "responseTabItem.bg"} mr="3" align="center" 
        _hover={{bg: "responseTabItem.activeBg"}}
        cursor="pointer"
        color={active ? "responseTabItem.activeColor": "responseTabItem.color"}
        >
        <Icon as={icon} boxSize="15px" />
        <Text fontSize={["11px","14px"]} mt={3} fontWeight="700">{label}</Text> 
    </Flex>
    )
}

export default ResponseTabItem

export const responseTabItemStyles = {
    responseTabItem:{
        bg: "white", 
        activeBg: "#F0F2F5",
        color:"#818197",
        activeColor:"#282F36"
    }
}
