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
      <MenuButton color="white" data-id="000519">
      <Flex align="center" data-id="000520" justify="space-between" w="100%">
  {/* Avatar and text */}
  <Flex align="center" data-id="000521" m={3}>
    <Avatar
      bg="userMenu.avatar.bg"
      borderColor={isOpen ? 'userMenu.avatar.borderColorOpened' : 'userMenu.avatar.borderColor'}
      borderRadius={"8px"}
      borderWidth="5px"
      color="userMenu.avatar.color"
      data-id="000522"
      h="40px"
      mr={3}
      name={user?.displayName?.replace(/\s*\(.*?\)\s*/g, '')}
      size="sm"
      src={user?.imgUrl}
      w="40px"
    />
     <Box data-id="000523" minW="0" textAlign={"start"}>
      <Text
        color={"black"}
        data-id="000524"
        fontSize={["12px", "14px"]}
        fontWeight="600"
        isTruncated>
        {user?.displayName}
      </Text>
      <Text
        color="gray.500"
        data-id="000525"
        fontSize="13px"
        isTruncated
        lineHeight={.8}>
        {(user?.role?.charAt(0).toUpperCase() || "") + (user?.role?.slice(1) || "")}
      </Text>
    </Box>
      <Icon
        as={ChevronDownIcon}
        boxSize={5}
        color="gray.500"
        data-id="000526"
        m={4} />

  </Flex>

</Flex>
      </MenuButton>
      <MenuList
        border="0px"
        borderRadius="10px"
        boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)"
        data-id="000527"
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
          borderBottomColor="userMenu.borderColor"
          borderBottomWidth="1px"
          color="userMenu.text"
          data-id="000529"
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
              data-id="000530"
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
          data-id="000531"
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
