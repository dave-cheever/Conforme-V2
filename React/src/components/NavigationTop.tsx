import { AddIcon } from "@chakra-ui/icons";
import {
  Flex,
  Stack,
  Image,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

import { QuestionMarkIcon } from "../icons";
import { useAppContext } from "../contexts/AppProvider";
import { useAdminContext } from "../contexts/AdminProvider";

const NavigationTop = () => {
  const {
    organizationConfig,
    user, setUser,
  } = useAppContext();
  const {
    setAdminModalState,
  } = useAdminContext();
  const history = useHistory();

  const logout = () => {
    fetch(`${process.env.REACT_APP_API_URL}/auth/logout`, {
      credentials: 'include',
      mode: 'no-cors',
    });
    setUser(null);
  };

  const pageRedirect = (page: string) => {
    history.push(page);
  };

  const handleAddButtonClick = () => {
    setAdminModalState('add');
    if ([
      '/',
      '/admin/users',
      '/admin/audit-log',
      '/admin/settings'
    ].includes(history.location.pathname)) {
      pageRedirect('/admin/compliance-items');
    }
  };

  return (
    <Flex
      justify="space-between"
      align="center"
      w="full"
      h="80px"
      bg="navigationTop.bg"
    >
      <Stack
        spacing={4}
        direction="row"
        align="center"
        fontWeight="400"
        fontSize="18px"
        w="full"
        mr={["0", "135px"]}
        ml={5}
      >
        <Flex display={["flex", "none"]} alignItems="center">
          <Image ignoreFallback src={organizationConfig?.logoUrl} h="44px" />
          <Text
            w="full"
            ml={3}
            fontWeight="700"
            fontSize="14px"
            color="#FFFFFF"
          >
            {organizationConfig?.name}
          </Text>
        </Flex>
        <IconButton
          onClick={handleAddButtonClick}
          _hover={{ opacity: 0.7 }}
          bg="navigationTop.addButton"
          h={["60px", "45px"]}
          w={["60px", "45px"]}
          color="white"
          aria-label="Add to friends"
          icon={<AddIcon />}
          position={["fixed", "relative"]}
          bottom={["15px", "0"]}
          right={["30px", "0"]}
          zIndex={5}
          flexShrink={0}
        />
        {/* <SearchBar /> */}
      </Stack>
      <Flex align="center">
        <QuestionMarkIcon
          _hover={{ color: "#ffffff", opacity: 0.7, cursor: "pointer" }}
          _active={{}}
          h="22px"
          w="22px"
          onClick={() => pageRedirect("/help")}
        />
        <Menu>
          <MenuButton
            display="flex"
            alignItems="center"
            py={1}
            ml="1"
            mr={["0", "6"]}
            color="white"
            w="50px"
          >
            <Avatar
              color="#FFFFFF"
              bg="navigationTop.avatarBg"
              rounded="full"
              name={user?.displayName}
              size="sm"
              src=""
              mx={3}
            />
          </MenuButton>
          <MenuList w="200px">
            <Text p="5px 12px" w="full" textOverflow="ellipsis" noOfLines={1}>
              {user?.displayName}
            </Text>
            <Text
              p="5px 12px"
              color="grey"
              w="full"
              textOverflow="ellipsis"
              noOfLines={1}
            >
              {user?.jobTitle}
            </Text>
            <MenuItem
              onClick={() => logout()}
            >
              Sign out
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default NavigationTop;
