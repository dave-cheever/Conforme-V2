import { useContext } from 'react';

import { Button, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';

import { OpenMenuArrow } from '../../icons';
import AuditModalContext from './AuditModalContext';

const SelectedBusinessUnit = () => {
  const modalContext = useContext(AuditModalContext);

  return (
    (<Menu data-id="248846222a0f">
      <MenuButton
        _active={{ bg: 'auditModal.menu.bg' }}
        _hover={{ bg: 'auditModal.menu.bg' }}
        as={Button}
        bg="auditModal.menu.bg"
        data-id="8c04044fa5e7"
        rightIcon={<OpenMenuArrow data-id="3288024c2839" ml="10px" />}>
        <Text
          color="auditModal.menu.text"
          data-id="0329d3d54ba4"
          fontSize="md"
          fontWeight="400">
          {modalContext.selectedBusinessUnit}
        </Text>
      </MenuButton>
      <MenuList data-id="899c4b2f6444">
        <MenuItem
          data-id="62613a02582b"
          minH="48px"
          onClick={() => modalContext.setSelectedBusinessUnit('Surgery')}>
          Surgery
        </MenuItem>
        <MenuItem
          data-id="ff8ef21501b2"
          minH="40px"
          onClick={() => modalContext.setSelectedBusinessUnit('Clinical')}>
          Clinical
        </MenuItem>
      </MenuList>
    </Menu>)
  );
};

export default SelectedBusinessUnit;
