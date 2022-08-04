import { useHistory } from 'react-router-dom';

import { Avatar, Menu, MenuButton, MenuList, Text, useDisclosure } from '@chakra-ui/react';
import addHours from 'date-fns/addHours';

import { userMenus } from '../bootstrap/config';
import { useAppContext } from '../contexts/AppProvider';
import useNavigate from '../hooks/useNavigate';
import { isPermitted } from './can';

const UserMenu = () => {
  const { user, setUser } = useAppContext();
  const history = useHistory();
  const { navigateTo } = useNavigate();
  const { onOpen, onClose, isOpen } = useDisclosure();

  const logout = async () => {
    history.push('/logout');
    await fetch(`${process.env.REACT_APP_API_URL}/auth/logout`, {
      credentials: 'include',
      mode: 'no-cors',
    });

    // logOut user is expired after 24 hours
    const logOutUser = {
      displayName: user?.displayName,
      imgUrl: user?.imgUrl,
      firstName: user?.firstName,
      expiresAt: addHours(new Date(), 24),
    };
    localStorage.setItem('logOutUser', JSON.stringify(logOutUser));
    setUser(null);
  };

  const pageRedirect = (page: string) => {
    navigateTo(page);
  };

  return (
    <Menu isOpen={isOpen} onClose={onClose} onOpen={onOpen}>
      <MenuButton color="white">
        <Avatar
          bg="userMenu.avatar.bg"
          borderColor={isOpen ? 'userMenu.avatar.borderColorOpened' : 'userMenu.avatar.borderColor'}
          borderWidth="5px"
          color="userMenu.avatar.color"
          h="41px"
          mr={5}
          name={user?.displayName}
          rounded="full"
          size="sm"
          src={user?.imgUrl}
          w="41px"
        />
      </MenuButton>
      <MenuList
        border="0px"
        borderRadius="10px"
        boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)"
        minW="175px"
        p="15px 20px 15px 20px"
        textAlign="right"
      >
        <Text fontWeight="semibold" noOfLines={1} textOverflow="ellipsis" w="full">
          {user?.displayName}
        </Text>
        <Text
          borderBottomColor="userMenu.borderColor"
          borderBottomWidth="1px"
          color="userMenu.text"
          fontSize="sm"
          mb="10px"
          noOfLines={1}
          pb="10px"
          textOverflow="ellipsis"
          w="full"
        >
          {user?.jobTitle}
        </Text>
        {userMenus
          .filter((userMenu) => !userMenu.permission || isPermitted({ user, action: userMenu.permission }))
          .map(({ label, url }) => (
            <Text
              _hover={{ color: 'userMenu.hoverColor' }}
              color="userMenu.text"
              cursor="pointer"
              fontSize="smm"
              key={label}
              my="10px"
              onClick={() => pageRedirect(url)}
            >
              {label}
            </Text>
          ))}

        <Text
          _hover={{ color: 'userMenu.hoverColor' }}
          borderTopColor="userMenu.borderColor"
          borderTopWidth="1px"
          color="userMenu.text"
          cursor="pointer"
          fontSize="smm"
          mt="10px"
          my="10px"
          onClick={() => logout()}
          pt="10px"
        >
          Logout
        </Text>
      </MenuList>
    </Menu>
  );
};

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
      borderColorOpened: '#E93C44',
    },
  },
};
