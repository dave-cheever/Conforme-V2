import { Button, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react'
import { useContext } from 'react';
import { OpenMenuArrow } from '../../icons'
import AuditModalContext from './AuditModalContext';


const SelectedArea = () => {

  const modalContext = useContext(AuditModalContext)

  return (
    <Menu>
      <MenuButton as={Button}
        bg="auditModal.menu.bg"
        _hover={{ bg: "auditModal.menu.bg" }}
        _active={{ bg: "auditModal.menu.bg" }}
        rightIcon={<OpenMenuArrow ml="10px" />}>
        <Text fontWeight="400" fontSize="md" color="auditModal.menu.text" >{modalContext.selectedArea}</Text>
      </MenuButton>
      <MenuList>
        <MenuItem minH="48px" onClick={() => modalContext.setSelectedArea("Surgery")} >
          Surgery
        </MenuItem>
        <MenuItem minH="40px" onClick={() => modalContext.setSelectedArea("Clinical")}>
          Clinical
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default SelectedArea;
