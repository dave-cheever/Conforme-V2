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
    <Menu data-id="000518" isOpen={isOpen} onClose={onClose} onOpen={onOpen}>
      <MenuButton data-id="000519" color="white">
      <Flex data-id="000520" align="center" justify="space-between" w="100%">
  {/* Avatar and text */}
  <Flex data-id="000521" align="center" m={3}>
    <Avatar
      data-id="000522"
      bg="userMenu.avatar.bg"
      borderColor={isOpen ? 'userMenu.avatar.borderColorOpened' : 'userMenu.avatar.borderColor'}
      borderRadius={"8px"}
      borderWidth="5px"
      color="userMenu.avatar.color"
      h="40px"
      mr={3}
      name={user?.displayName?.replace(/\s*\(.*?\)\s*/g, '')}
      size="sm"
      src={user?.imgUrl}
      w="40px"
    />
     <Box data-id="000523" minW="0" textAlign={"start"}>
      <Text
        data-id="000524"
        color={"black"}
        fontSize={["12px", "14px"]}
        fontWeight="600"
        isTruncated>
        {user?.displayName}
      </Text>
      <Text
        data-id="000525"
        color="gray.500"
        fontSize="13px"
        isTruncated
        lineHeight={.8}>
        {(user?.role?.charAt(0).toUpperCase() || "") + (user?.role?.slice(1) || "")}
      </Text>
    </Box>
      <Icon
        data-id="000526"
        as={ChevronDownIcon}
        boxSize={5}
        color="gray.500"
        m={4} />

  </Flex>

</Flex>
      </MenuButton>
      <MenuList
        data-id="000527"
        border="0px"
        borderRadius="10px"
        boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)"
        minW="175px"
        mr={3}
        p="15px 20px 15px 20px"
        textAlign="right"
      >
        <Text
          data-id="000528"
          fontWeight="semibold"
          noOfLines={1}
          textOverflow="ellipsis"
          w="full">
          {user?.displayName}
        </Text>
        <Text
          data-id="000529"
          borderBottomColor="userMenu.borderColor"
          borderBottomWidth="1px"
          color="userMenu.text"
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
              data-id="000530"
              _hover={{ color: 'userMenu.hoverColor' }}
              color="userMenu.text"
              cursor="pointer"
              fontSize="smm"
              key={label}
              my="10px"
              onClick={() => pageRedirect(url)}>
              {label}
            </Text>
          ))}

        <Text
          data-id="000531"
          _hover={{ color: 'userMenu.hoverColor' }}
          borderTopColor="userMenu.borderColor"
          borderTopWidth="1px"
          color="userMenu.text"
          cursor="pointer"
          fontSize="smm"
          mt="10px"
          my="10px"
          onClick={logout}
          pt="10px">
          Logout
        </Text>
      </MenuList>
    </Menu>
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
