import { useContext } from 'react';

import { Button, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';

import { OpenMenuArrow } from '../../icons';
import AuditModalContext from './AuditModalContext';

function SelectedBusinessUnit() {
  const modalContext = useContext(AuditModalContext);

  return (
    <Menu data-id="030925-f5e386">
      <MenuButton
        data-id="030925-da9511"
        _active={{ bg: 'auditModal.menu.bg' }}
        _hover={{ bg: 'auditModal.menu.bg' }}
        as={Button}
        bg="auditModal.menu.bg"
        rightIcon={<OpenMenuArrow data-id="030925-082010" ml="10px" />}>
        <Text
          data-id="030925-6d6da2"
          color="auditModal.menu.text"
          fontSize="md"
          fontWeight="400">
          {modalContext.selectedBusinessUnit}
        </Text>
      </MenuButton>
      <MenuList data-id="030925-a515f8">
        <MenuItem
          data-id="030925-3feabe"
          minH="48px"
          onClick={() => modalContext.setSelectedBusinessUnit('Surgery')}>
          Surgery
        </MenuItem>
        <MenuItem
          data-id="030925-c95f2d"
          minH="40px"
          onClick={() => modalContext.setSelectedBusinessUnit('Clinical')}>
          Clinical
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default SelectedBusinessUnit;
