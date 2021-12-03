import { AddIcon } from "@chakra-ui/icons";
import {
  Flex,
  Stack,
  Text,
  IconButton
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

import { QuestionMarkIcon } from "../icons";
import { useAppContext } from "../contexts/AppProvider";
import { useAdminContext } from "../contexts/AdminProvider";
import UserMenu from "./UserMenu";

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
        fontWeight="400"
        fontSize="18px"
        w="full"
        mr={["0", "135px"]}
        ml={5}
      >
        <Flex display={["flex", "none"]} alignItems="center">
          <Text
            w="full"
            ml={[0,6]}
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
          bottom={["0px", "0"]}
          right={["30px", "0"]}
          zIndex={5}
          flexShrink={0}
        />
        {/* <SearchBar /> */}
      </Stack>
      <Flex align="center" mr={3}>
        <QuestionMarkIcon
          _hover={{ color: "#ffffff", opacity: 0.7, cursor: "pointer" }}
          _active={{}}
          h="22px"
          w="22px"
          onClick={() => pageRedirect("/help")}
        />
        <UserMenu/>
      </Flex>
    </Flex>
  );
};

export default NavigationTop;


export const navigationTopStyles = {
  navigationTop: {
    bg: "#E5E5E5",
    addButton: "#462AC4"
  }
}
