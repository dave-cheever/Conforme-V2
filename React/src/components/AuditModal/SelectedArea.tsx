import { useContext } from 'react';

import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';

import { OpenMenuArrow } from '../../icons';
import AuditModalContext from './AuditModalContext';

const SelectedArea = () => {
  const modalContext = useContext(AuditModalContext);

  return (
    <Menu>
      <MenuButton
        _active={{ bg: 'auditModal.menu.bg' }}
        _hover={{ bg: 'auditModal.menu.bg' }}
        as={Button}
        bg="auditModal.menu.bg"
        rightIcon={<OpenMenuArrow ml="10px" />}
      >
        <Text color="auditModal.menu.text" fontSize="md" fontWeight="400">
          {modalContext.selectedArea}
        </Text>
      </MenuButton>
      <MenuList>
        <MenuItem
          minH="48px"
          onClick={() => modalContext.setSelectedArea('Surgery')}
        >
          Surgery
        </MenuItem>
        <MenuItem
          minH="40px"
          onClick={() => modalContext.setSelectedArea('Clinical')}
        >
          Clinical
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default SelectedArea;
