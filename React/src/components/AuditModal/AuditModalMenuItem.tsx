import { useContext, useMemo } from 'react';

import { Box, Icon, Text } from '@chakra-ui/react';

import { IAuditModalMenuItemProps } from '../../interfaces/IAuditModalMenuItemProps';
import AuditModalContext from './AuditModalContext';

const AuditModalMenuItem = ({ label, icon }: IAuditModalMenuItemProps) => {
  const modalContext = useContext(AuditModalContext);
  const active = useMemo(
    () => modalContext.activePage === label,
    [modalContext.activePage, label],
  );

  return (
    <Box
      alignItems="center"
      cursor="pointer"
      display="flex"
      justifyContent="start"
      mb="20px"
      onClick={() => modalContext.setActivePage(label)}
    >
      <Box
        bg={
          active
            ? 'auditModal.menu.active.indicator'
            : 'auditModal.menu.inActive.indicator'
        }
        borderRadius="0px 4px 4px 0px"
        display="inline"
        h="38px"
        mr="20px"
        w="10px"
      />
      <Icon
        boxSize={6}
        mr="20px"
        stroke={
          active
            ? 'auditModal.menu.active.icon'
            : 'auditModal.menu.inActive.icon'
        }
        transform="translate(0px, -2px)"
        transformOrigin="center"
      >
        {icon}
      </Icon>
      <Text
        color={
          active
            ? 'auditModal.menu.active.text'
            : 'auditModal.menu.inActive.text'
        }
        fontSize="md"
        fontWeight="400"
      >
        {label}
      </Text>
    </Box>
  );
};

export default AuditModalMenuItem;
