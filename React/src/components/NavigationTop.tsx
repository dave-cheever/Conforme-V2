import {
  Flex,
  Stack,
  Text,
  IconButton,
  Badge,
  Input, 
  InputGroup, 
  InputLeftElement
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

import { AddIcon, SearchIcon, NotificationIcon } from "../icons";
import { useAppContext } from "../contexts/AppProvider";
import { useAdminContext } from "../contexts/AdminProvider";
import UserMenu from "./UserMenu";
import Can from "./can";

const NavigationTop = () => {
  const {
    organizationConfig,
  } = useAppContext();
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
      w={["100vw","full"]}
      h="80px"
      bg="navigationTop.bg"
      position={["fixed","relative"]}
    >
      <Stack
        spacing={4}
        direction="row"
        align="center"
        fontWeight="semi_medium"
        fontSize="lg"
        w="full"
        mr={["0", "135px"]}
        ml={5}
      >
        <Flex display={["flex", "none"]} alignItems="center">
          <Text
            w="full"
            ml={[0,6]}
            fontWeight="bold"
            fontSize="md"
            lineHeight= "19px"
            color="navigationTop.organizationName"
          >
            {organizationConfig?.name}
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
            icon={<AddIcon h="20px" w="20px"/>}
            position={['fixed', 'relative']}
            bottom={['75px', '0']}
            right={['16px', '0']}
            zIndex={5}
            flexShrink={0}
         	rounded={["20px", "8px"]}
            display={['/', '/admin/users', '/admin/settings', '/admin/audit-log'].includes(history.location.pathname) ? 'none' : 'block'}
          />}
        />
        {/* <SearchBar /> */}
      <Flex>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            color="navigationTop.inputIconColor"
            children={<SearchIcon fill="navigationTop.searchBarIcon" stroke="brand.outerSpace" opacity="1"/>}
          />
          <Input bg= "navigationTop.inputBg" rounded= "20px" placeholder="Search" fontWeight="semi_medium" fontSize="smm"></Input>
        </InputGroup>
      </Flex>
      </Stack>
      <Flex align="center">
        <NotificationIcon
          _hover={{ color: "navigationTop.notificationIconHover", opacity: 0.7, cursor: "pointer" }}
          _active={{}}
          h="20px"
          w="22px"
        />
        <Badge variant="solid" bg="navigationTop.notificationColorScheme" border="2px solid" borderColor="navigationTop.notificationBadgeBorder" borderRadius="5px" cursor="pointer">3</Badge>
        <UserMenu/>
      </Flex>
    </Flex>
  );
};

export default NavigationTop;

export const navigationTopStyles = {
  navigationTop: {
    bg: "#E5E5E5",
    inputBg: "#FFFFFF",
    inputIconColor: "#282F36",
    organizationName: "#FFFFFF",
    addButton: "#462AC4",
    avatarBg: "#A2171E",
    searchBarIconFill: "#282F36",
    notificationIconHover: "#FFFFFF",
    notificationBadgeBorder: "#FFFFFF",
    notificationColorScheme: "#E93C44",
  }
}
