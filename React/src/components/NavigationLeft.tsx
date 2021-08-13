import { useContext, useEffect, useState } from "react";
import { Box, Flex, Image, Text, Avatar } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import {
  Dashboard,
  Accidents,
  Assets,
  Audits,
  Bar,
  Licenses,
  Mentions,
  Note,
  Policies,
  Actions,
} from "../icons";
import { IStore, store } from "../bootstrap/store";
import NavigationLeftItem from "./NavigationLeftItem";
import { menuItems } from "../bootstrap/config";

const NavigationLeft = () => {
  const { state }: IStore = useContext(store);
  const { organizationConfig } = state;
  const history = useHistory();
  const [activeMenu, setActiveMenu] = useState("/");

  useEffect(() => {
    menuItems.map((menuItem) => {
      if (history.location.pathname.includes(menuItem.url)) {
        setActiveMenu(menuItem.url);
      }
      return null;
    });
  });

  return (
    <Flex
      w="240px"
      p="20px 0"
      bg="navigationLeft.bg"
      color="white"
      direction="column"
    >
      <Box display="flex" h="80px" cursor="pointer">
        <Image
          ignoreFallback
          src={organizationConfig?.logoUrl}
          h="42px"
          w="36px"
          position="absolute"
          top="17px"
          left="17px"
        />
        <Text
          fontWeight="bold"
          fontSize="14px"
          lineHeight="132.1%"
          position="absolute"
          top="30px"
          left="38px"
        >
          {organizationConfig?.name}
        </Text>
      </Box>

      <Box ml="26px">
        <NavigationLeftItem
          icon={Dashboard}
          title={"Dashboard"}
          url={"home"}
          isActive={activeMenu === "/"}
        />

        <NavigationLeftItem
          icon={Audits}
          title={"Audits"}
          url={"audits"}
          isActive={activeMenu === "/audits"}
        />

        <NavigationLeftItem
          icon={Licenses}
          title={"Licenses"}
          url={"licenses"}
          isActive={activeMenu === "/licenses"}
        />

        <NavigationLeftItem
          icon={Assets}
          title={"Assets"}
          url={"assets"}
          isActive={activeMenu === "/assets"}
        />

        <NavigationLeftItem
          icon={Actions}
          title={"Actions"}
          url={"actions"}
          isActive={activeMenu === "/actions"}
        />

        <NavigationLeftItem
          icon={Accidents}
          title={"Accidents"}
          url={"accidents"}
          isActive={activeMenu === "/accidents"}
        />

        <NavigationLeftItem
          icon={Policies}
          title={"Policies"}
          url={"policies"}
          isActive={activeMenu === "/policies"}
        />

        <Box display="flex" flexDirection="row" alignContent="center">
          <Bar
            width="46px"
            left="25px"
            top="10px"
            mb="28px"
            mr="25px"
            ml="-26px"
            mt="11px"
          />
          <Text
            fontSize="11px"
            lineHeight="13px"
            mt="11px"
            color="navigationLeft.menuList.unselectedMenuItem"
            onClick={() => history.push("/policies")}
          >
            CHAT
          </Text>
        </Box>

        <Box display="flex" flexDirection="row" alignContent="center">
          <Mentions
            width="22px"
            height="22px"
            left="25px"
            top="10px"
            mb="28px"
            mr="24px"
          />
          <Note position="absolute" left="39px" top="498px" />
          <Text
            fontSize="16px"
            lineHeight="19px"
            color="navigationLeft.menuList.unselectedMenuItem"
            cursor="pointer"
            mr="13px"
            onClick={() => history.push("/mentions")}
          >
            Mentions
          </Text>
          <Flex width="74px" justifyContent="space-between">
            <Avatar
              name="Mention1"
              src="https://i.ibb.co/V2RtVyN/Ellipse-3.png"
              h="22px"
              w="22px"
            />
            <Avatar
              name="Mention2"
              src="https://i.ibb.co/WtJM5B5/Ellipse-2.png"
              h="22px"
              w="22px"
            />
            <Avatar
              name="Mention2"
              src="https://i.ibb.co/8NrPHLD/Ellipse-1.png"
              h="22px"
              w="22px"
            />
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
};

export default NavigationLeft;
