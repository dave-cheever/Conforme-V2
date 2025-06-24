import { ChevronDownIcon } from '@chakra-ui/icons';
import { Avatar, Box, Flex, Icon, Menu, MenuButton, MenuList, Text, useDisclosure } from '@chakra-ui/react';

import { userMenus } from '../bootstrap/config';
import { useAppContext } from '../contexts/AppProvider';
import useLogout from '../hooks/useLogout';
import useNavigate from '../hooks/useNavigate';
import { isPermitted } from './can';

function UserMenu() {
  const { user } = useAppContext();
  const { navigateTo } = useNavigate();
  const logout = useLogout();
  const { onOpen, onClose, isOpen } = useDisclosure();

  const pageRedirect = (page: string) => {
    navigateTo(page);
  };

  return (
    (<Menu data-id="e985cdb96443" isOpen={isOpen} onClose={onClose} onOpen={onOpen}>
      <MenuButton color="white" data-id="74d7a3b3cdc8">
      <Flex align="center" justify="space-between" w="100%">
  {/* Avatar and text */}
  <Flex align="center" m={5}>
    <Avatar
      bg="userMenu.avatar.bg"
      borderColor={isOpen ? 'userMenu.avatar.borderColorOpened' : 'userMenu.avatar.borderColor'}
      borderRadius={"md"}
      borderWidth="5px"
      color="userMenu.avatar.color"
      data-id="8c0b24efa538"
      h="41px"
      mr={3}
      name={user?.displayName}
      size="md"
      src={user?.imgUrl}
      w="41px"
    />
     <Box minW="0" textAlign={"start"}>
      <Text color={"black"} fontSize={["12px", "14px"]} fontWeight="600" isTruncated>
        {user?.displayName}
      </Text>
      <Text color="gray.500" fontSize="xs" isTruncated>
        {user?.role}
      </Text>
    </Box>
      <Icon as={ChevronDownIcon} boxSize={5} color="gray.500" m={4} />

  </Flex>

</Flex>
      </MenuButton>
      <MenuList
        border="0px"
        borderRadius="10px"
        boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)"
        data-id="d3cc6dae5991"
        minW="175px"
        mr={3}
        p="15px 20px 15px 20px"
        textAlign="right"
      >
        <Text
          data-id="6d4b2e8e6139"
          fontWeight="semibold"
          noOfLines={1}
          textOverflow="ellipsis"
          w="full">
          {user?.displayName}
        </Text>
        <Text
          borderBottomColor="userMenu.borderColor"
          borderBottomWidth="1px"
          color="userMenu.text"
          data-id="8897a95d09de"
          fontSize="sm"
          mb="10px"
          noOfLines={1}
          pb="10px"
          textOverflow="ellipsis"
          w="full">
          {user?.jobTitle}
        </Text>
        {userMenus
          .filter((userMenu) => !userMenu.permission || isPermitted({ user, action: userMenu.permission }))
          .map(({ label, url }) => (
            <Text
              _hover={{ color: 'userMenu.hoverColor' }}
              color="userMenu.text"
              cursor="pointer"
              data-id="a1d75f8fe1c6"
              fontSize="smm"
              key={label}
              my="10px"
              onClick={() => pageRedirect(url)}>
              {label}
            </Text>
          ))}

        <Text
          _hover={{ color: 'userMenu.hoverColor' }}
          borderTopColor="userMenu.borderColor"
          borderTopWidth="1px"
          color="userMenu.text"
          cursor="pointer"
          data-id="665372c08e6c"
          fontSize="smm"
          mt="10px"
          my="10px"
          onClick={logout}
          pt="10px">
          Logout
        </Text>
      </MenuList>
    </Menu>)
  );
}

export default UserMenu;

export const userMenuStyles = {
  userMenu: {
    text: '#818197',
    borderColor: '#F0F0F0',
    hoverColor: '#462AC4',
    avatar: {
      color: 'white',
      bg: '#462AC4',
      borderColor: 'white',
      // borderColorOpened: '#E93C44',
    },
  },
};
