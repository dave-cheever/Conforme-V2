import React from 'react'
import { useHistory } from 'react-router';
import { Menu, MenuButton, Avatar, MenuList, Text, useDisclosure } from '@chakra-ui/react';
import addHours from 'date-fns/addHours';

import { userMenus } from '../bootstrap/config';
import { useAppContext } from '../contexts/AppProvider';

const UserMenu = () => {
  const { user, setUser } = useAppContext();
  const history = useHistory();
  const { onOpen, onClose, isOpen } = useDisclosure();

  const logout = async () => {
    history.push("/logout");
    await fetch(`${process.env.REACT_APP_API_URL}/auth/logout`, {
      credentials: 'include',
      mode: 'no-cors',
    });

    // logOut user is expired after 24 hours
    const logOutUser = {
      displayName: user?.displayName,
      imgUrl: user?.imgUrl,
      firstName: user?.firstName,
      expiresAt: addHours(new Date(), 24)
    }
    await localStorage.setItem("logOutUser", JSON.stringify(logOutUser));
    setUser(null);
  };

  const pageRedirect = (page: string) => {
    history.push(page);
  };

  return (
    <Menu onOpen={onOpen} onClose={onClose} isOpen={isOpen}>
      <MenuButton
        display="flex"
        ml="1"
        mr={["0", "6"]}
        color="white"
        w="65px"
      >
        <Avatar
          color="userMenu.avatar.color"
          bg="userMenu.avatar.bg"
          rounded="full"
          name={user?.displayName}
          h="41px"
          w="41px"
          src={user?.imgUrl}
          mx={3}
          borderWidth="5px"
          borderColor={isOpen ? "userMenu.avatar.borderColorOpened" : "userMenu.avatar.borderColor"}
          size="sm"
        />
      </MenuButton>
      <MenuList border="0px" borderRadius="10px" minW="175px" p="15px 20px 15px 20px" textAlign="right" boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)">
        <Text fontWeight="semibold" w="full" textOverflow="ellipsis" noOfLines={1}>
          {user?.displayName}
        </Text>
        <Text
          color="userMenu.text"
          w="full"
          textOverflow="ellipsis"
          noOfLines={1}
          fontSize="sm"
          pb="10px"
          borderBottomColor="userMenu.borderColor"
          borderBottomWidth="1px"
          mb="10px"
        >
          {user?.jobTitle}
        </Text>
        {userMenus.map(({ label, url }) =>
          <Text
            key={label}
            cursor="pointer"
            color="userMenu.text"
            my="10px"
            fontSize="smm"
            _hover={{ color: "userMenu.hoverColor" }}
            onClick={() => pageRedirect(url)}
          >{label}
          </Text>)}

        <Text
          cursor="pointer"
          color="userMenu.text"
          my="10px"
          fontSize="smm"
          onClick={() => logout()}
          pt="10px"
          borderTopColor="userMenu.borderColor"
          borderTopWidth="1px"
          mt="10px"
          _hover={{ color: "userMenu.hoverColor" }}
        >Logout</Text>
      </MenuList>
    </Menu>
  )
}

export default UserMenu;


export const userMenuStyles = {
  userMenu: {
    text: "#818197",
    borderColor: "#F0F0F0",
    hoverColor: "#462AC4",
    avatar: {
      color: "white",
      bg: "#462AC4",
      borderColor: "white",
      borderColorOpened: "#E93C44"
    }
  }
}
