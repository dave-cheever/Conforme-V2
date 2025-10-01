import { useContext } from 'react';

import { Button, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';

import { OpenMenuArrow } from '../../icons';
import AuditModalContext from './AuditModalContext';

function SelectedBusinessUnit() {
  const modalContext = useContext(AuditModalContext);

  return (
    <Menu data-id="000461">
      <MenuButton
        _active={{ bg: 'auditModal.menu.bg' }}
        _hover={{ bg: 'auditModal.menu.bg' }}
        as={Button}
        bg="auditModal.menu.bg"
        data-id="000462"
        rightIcon={<OpenMenuArrow data-id="000463" ml="10px" />}>
        <Text
          color="auditModal.menu.text"
          data-id="000464"
          fontSize="md"
          fontWeight="400">
          {modalContext.selectedBusinessUnit}
        </Text>
      </MenuButton>
      <MenuList data-id="000465">
        <MenuItem
          data-id="000466"
          minH="48px"
          onClick={() => modalContext.setSelectedBusinessUnit('Surgery')}>
          Surgery
        </MenuItem>
        <MenuItem
          data-id="000467"
          minH="40px"
          onClick={() => modalContext.setSelectedBusinessUnit('Clinical')}>
          Clinical
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default SelectedBusinessUnit;
