import Icon from '@chakra-ui/icon'
import { Box, Text } from '@chakra-ui/layout'
import { useContext, useMemo } from 'react';
import { IAuditModalMenuItemProps } from '../../interfaces/IAuditModalMenuItemProps'
import AuditModalContext from './AuditModalContext';

const AuditModalMenuItem = ({ label, icon }: IAuditModalMenuItemProps) => {

  const modalContext = useContext(AuditModalContext);
  const active = useMemo(() => modalContext.activePage === label, [modalContext.activePage, label]);


  return (
    <Box display="flex" justifyContent="start"
      alignItems="center" cursor="pointer"
      mb="20px"
      onClick={() => modalContext.setActivePage(label)}>
      <Box h="38px" display="inline" w="10px" mr="20px"
        bg={active ?
          "auditModal.menu.active.indicator" :
          "auditModal.menu.inActive.indicator"}
        borderRadius="0px 4px 4px 0px" />
      <Icon
        boxSize={6}
        mr="20px"
        transformOrigin="center"
        transform="translate(0px, -2px)"
        stroke={active ? "auditModal.menu.active.icon"
          : "auditModal.menu.inActive.icon"}
      >
        {icon}
      </Icon>
      <Text fontWeight="400" fontSize="md" color={active ?
        "auditModal.menu.active.text" :
        "auditModal.menu.inActive.text"} >
        {label}
      </Text>
    </Box>
  )
}

export default AuditModalMenuItem
