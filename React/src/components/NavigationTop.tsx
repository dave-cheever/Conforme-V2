import {
  Flex,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

import { AddIcon, SearchIcon } from "../icons";
import { useAdminContext } from "../contexts/AdminProvider";
import { useFiltersContext } from "../contexts/FiltersProvider";
import { useAppContext } from "../contexts/AppProvider";
import Can from "./can";
import UserMenu from "./UserMenu";
import SearchBar from "./SearchBar";
import NavigationTopProvider, { useNavigationTopContext } from "../contexts/NavigationTopProvider";
import useDevice from "../hooks/useDevice";

const NavigationTop = () => {
  const device = useDevice();
  const history = useHistory();
  const { organizationConfig } = useAppContext();
  const { setAdminModalState } = useAdminContext();
  const { showFiltersPanel } = useFiltersContext();
  const { isSearchBarOpen, setIsSearchBarOpen } = useNavigationTopContext();

  const pageRedirect = (page: string) => {
    history.push(page);
  };
  const isComplianceItemPage = history.location.pathname.split('/')[1] === "compliance-item";

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
        display="flex"
      >
        <Flex
          alignItems="center"
          h="80px"
          onClick={() => history.push('/')}
          cursor="pointer"
          display={device !== "mobile" || isSearchBarOpen ? "none" : "flex"}
        >
          <Text
            w="full"
            ml={["26px", 0]}
            fontWeight="bold"
            fontSize="md"
            lineHeight="19px"
            color="navigationTop.organizationName"
          >
            {showFiltersPanel ? organizationConfig?.name.charAt(0) : organizationConfig?.name}
          </Text>
        </Flex>
        {!isComplianceItemPage && <Can
          action='adminPanel'
          yes={() => <IconButton
            onClick={handleAddButtonClick}
            _hover={{ opacity: 0.7 }}
            mr="30px"
            bg="navigationTop.addButton"
            h={['52px', '45px']}
            w={['52px', '45px']}
            color="white"
            aria-label="Add"
            icon={<AddIcon stroke="navigationTop.addIcon" h="20px" w="20px" />}
            position={['fixed', 'relative']}
            bottom={['75px', '0']}
            right={['15px', '0']}
            zIndex={5}
            boxShadow={["0px 0px 80px rgba(49, 50, 51, 0.25)", "none"]}
            flexShrink={0}
            rounded={["20px", "8px"]}
            display={['/', '/admin/users', '/admin/settings', '/admin/audit-log'].includes(history.location.pathname) ? 'none' : 'block'}
          />}
        />}

        <Flex display={device !== "mobile" || (device === "mobile" && isSearchBarOpen) ? "block" : "none"}>
          <SearchBar />
        </Flex>
      </Stack>

      <Flex
        align="center"
        display={device === "mobile" && isSearchBarOpen ? "none" : "flex"}
      >
        <IconButton
          mr="27.5px"
          align="center"
          bg="navigationTop.searchIconBackground"
          aria-label='Search responses'
          borderRadius="20px"
          icon={<SearchIcon h="22px" w="18px" fill="navigationTop.searchBarIcon" stroke="brand.outerSpace" opacity="1" />}
          display={["block", "none"]}
          onClick={() => setIsSearchBarOpen(true)}
        />
        {/* <NotificationIcon
          _hover={{ color: "navigationTop.notificationIconHover", opacity: 0.7, cursor: "pointer" }}
          _active={{}}
          h="20px"
          w="22px"
        />
        <Badge variant="solid" bg="navigationTop.notificationColorScheme" border="2px solid" borderColor="navigationTop.notificationBadgeBorder" borderRadius="5px" cursor="pointer">3</Badge> */}
        <UserMenu />
      </Flex>

      {/* <Stack
        spacing={4}
        direction="row"
        align="center"
        fontWeight="semi_medium"
        fontSize="md"
        w="full"
        ml={5}
        display={device === "mobile" && isSearchBarOpen ? "block" : "none"}
      >
        <SearchBar />
      </Stack> */}
    </Flex >
  );
};

const NavigationTopWithContext = (props) => (
  <NavigationTopProvider {...props}>
    <NavigationTop />
  </NavigationTopProvider>
);

export default NavigationTopWithContext;

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
    searchCrossIconStroke: "#282F36",
    addIcon: "#FFFFFF",
  }
}
