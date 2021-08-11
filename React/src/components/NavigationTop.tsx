import { useContext } from "react";
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

import { IState, IStore, store } from "../bootstrap/store";
import { QuestionIcon } from "../icons";

const NavigationTop = () => {
  const { state }: IStore = useContext(store);
  const { organizationConfig, user }: IState = state;
  const history = useHistory();

  const pageRedirect = (page: string) => {
    history.push(page);
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
          // onClick={handleAddButtonClick}
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
        <QuestionIcon
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
            color="brand.primaryFont"
            w="50px"
          >
            <Avatar
              color="#FFFFFF"
              bg="brand.primary"
              rounded="full"
              name={user?.getFullName()}
              size="sm"
              src=""
              mx={3}
            />
          </MenuButton>
          <MenuList w="200px">
            <Text p="5px 12px" w="full" textOverflow="ellipsis" noOfLines={1}>
              {user?.getFullName()}
            </Text>
            <Text
              p="5px 12px"
              color="grey"
              w="full"
              textOverflow="ellipsis"
              noOfLines={1}
            >
              {user?.getJobTitle()}
            </Text>
            <MenuItem
            // onClick={() => logout()}
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
