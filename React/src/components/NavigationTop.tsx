import {
  Badge,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from 'react';
import { useHistory } from "react-router-dom";
import { AddIcon, SearchIcon, NotificationIcon, CrossIcon } from "../icons";
import { useAdminContext } from "../contexts/AdminProvider";
import { useFiltersContext } from "../contexts/FiltersProvider";
import { useAppContext } from "../contexts/AppProvider";
import Can from "./can";
import UserMenu from "./UserMenu";

const NavigationTop = () => {
  const [displaySearch, setDisplaySearch] = useState(false);
  const {
    organizationConfig
  } = useAppContext();

  const {
    showFiltersPanel
  } = useFiltersContext();

  const {
    setAdminModalState,
  } = useAdminContext();
  const history = useHistory();

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
      w={["100vw", "full"]}
      position={["fixed", "relative"]}
      zIndex={10}
      h={["72px", "80px"]}
      bg={["navigationTop.bgMobile", "navigationTop.bg"]}
    >
      <Stack
        spacing={4}
        direction="row"
        align="center"
        fontWeight="semi_medium"
        fontSize="md"
        w="full"
        mr={["0", "20px"]}
        display={displaySearch ? "none" : "flex"}
      >
        <Flex
          display={["flex", "none"]}
          alignItems="center"
          h="80px"
          onClick={() => history.push('/')}
          cursor="pointer"
        >
          <Text
            w="full"//80px
            ml={["26px", 0]}
            fontWeight="bold"
            fontSize="md"
            lineHeight="19px"
            color="navigationTop.organizationName"
          >
            {showFiltersPanel ? organizationConfig?.name.charAt(0) : organizationConfig?.name}
          </Text>
        </Flex>
        <Can
          action='adminPanel'
          yes={() => <IconButton
            onClick={handleAddButtonClick}
            _hover={{ opacity: 0.7 }}
            mr="30px"
            bg="navigationTop.addButton"
            h={['60px', '45px']}
            w={['60px', '45px']}
            color="white"
            aria-label="Add"
            icon={<AddIcon h="20px" w="20px" />}
            position={['fixed', 'relative']}
            bottom={['20px', '0']}
            right={['30px', '0']}
            zIndex={5}
            flexShrink={0}
            rounded={["20px", "8px"]}
            display={['/', '/admin/users', '/admin/settings', '/admin/audit-log'].includes(history.location.pathname) ? 'none' : 'block'}
          />}
        />
        <Flex>
          <InputGroup display={["none", "block"]} w={["100%", "260px"]}>
            <InputLeftElement
              pointerEvents="none"
              color="navigationTop.inputIconColor"
              children={<SearchIcon fill="navigationTop.searchBarIcon" stroke="brand.outerSpace" opacity="1" />}
            />
            <Input bg="navigationTop.inputBg" rounded="20px" placeholder="Search" fontWeight="semi_medium" fontSize="smm"></Input>
          </InputGroup>
        </Flex>
      </Stack>

      <Flex
        align="center"
        display={displaySearch ? "none" : "flex"}
      >
        <IconButton
          mr="27.5px"
          align="center"
          bg="navigationTop.searchIconBackground"
          aria-label='Search database'
          borderRadius="20px"
          icon={<SearchIcon h="22px" w="18px" fill="navigationTop.searchBarIcon" stroke="brand.outerSpace" opacity="1" />}
          display={["block", "none"]}
          onClick={() => { setDisplaySearch(true) }}
        />
        <NotificationIcon
          _hover={{ color: "navigationTop.notificationIconHover", opacity: 0.7, cursor: "pointer" }}
          _active={{}}
          h="20px"
          w="22px"
        />
        <Badge variant="solid" bg="navigationTop.notificationColorScheme" border="2px solid" borderColor="navigationTop.notificationBadgeBorder" borderRadius="5px" cursor="pointer">3</Badge>
        <UserMenu />
      </Flex>

      <Stack
        spacing={4}
        direction="row"
        align="center"
        fontWeight="semi_medium"
        fontSize="md"
        w="full"
        mr={["0", "20px"]}
        ml={5}
        display={displaySearch ? "block" : "none"}
      >
        <Flex>
          <InputGroup display={["block", "none"]} w={["calc(100vw - 50px)"]}>
            <InputLeftElement
              pointerEvents="none"
              color="navigationTop.inputIconColor"
              children={<SearchIcon fill="navigationTop.searchBarIcon" stroke="brand.outerSpace" opacity="1" />}
            />
            <InputRightElement width='10px'>
              <CrossIcon
                _hover={{ color: "navigationTop.notificationIconHover", opacity: 0.7, cursor: "pointer" }}
                _active={{}}
                h="13.5px"
                w="13.5px"
                onClick={() => { setDisplaySearch(false) }}
                stroke="navigationTop.searchCrossIconStroke"
              />
            </InputRightElement>
            <Input bg="navigationTop.inputBg" rounded="20px" placeholder="Search" fontWeight="semi_medium" fontSize="smm"></Input>
          </InputGroup>
        </Flex>
      </Stack>
    </Flex>
  );
};

export default NavigationTop;

export const navigationTopStyles = {
  navigationTop: {
    bg: "#E5E5E5",
    bgMobile: "#FFFFFF",
    inputBg: "#FFFFFF",
    inputIconColor: "#282F36",
    organizationName: "#282F36",
    addButton: "#462AC4",
    searchIconBackground: "#F0F0F0",
    avatarBg: "#A2171E",
    searchBarIconFill: "#282F36",
    notificationIconHover: "#FFFFFF",
    notificationBadgeBorder: "#FFFFFF",
    notificationColorScheme: "#E93C44",
    searchCrossIconStroke: "#282F36"
  }
}
