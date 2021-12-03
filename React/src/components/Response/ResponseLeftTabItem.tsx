import React, { useMemo } from 'react';
import { Flex, Icon} from '@chakra-ui/react';
import { useHistory, useParams } from 'react-router-dom';

const ResponseLeftTabItem = ({label,icon, url, isDesktop = true, isMobile = false}) => {

    const history = useHistory();
    const { id }: {id: string} = useParams();
    
    const active = useMemo(() => {
        return history.location.pathname === `/compliance-item/${id}${url}`;
    },[id, url, history]);

    const redirectPage = () => {
        history.push(`/compliance-item/${id}${url}`);
    }

    return (
    <Flex mb={[0,3]} mx={[3, 0]} align="center" cursor="pointer" onClick={redirectPage}>
        <Flex w="30px" h="30px" bg={active? "responseLeftTabItem.activeIconBg" :"responseLeftTabItem.iconBg"} borderRadius="8px" align="center" justify="center">
        <Icon
            as={icon}
            color={active ? "responseLeftTabItem.activeIconColor" :"responseLeftTabItem.iconColor" }
            />
        </Flex>
        { (isDesktop || (isMobile && active) ) && <Flex flexGrow={1} fontSize={["11px","14px"]} color={active ? ["responseLeftTabItem.textColor","responseLeftTabItem.activeTextColor"] :"responseLeftTabItem.textColor"} ml={3}>{label}</Flex>}
    </Flex>
    );
}

export default ResponseLeftTabItem

export const responseLeftTabItemStyles = {
    responseLeftTabItem:{
        iconBg:"#FFFFFF",
        activeIconBg: "#462AC4",
        activeTextColor:"#1F1F1F",
        textColor:"#818197",
        activeIconColor:"white",
        iconColor:"#818197"
    }
}
