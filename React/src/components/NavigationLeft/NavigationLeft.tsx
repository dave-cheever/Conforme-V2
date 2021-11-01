import { useEffect, useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

import NavigationLeftItem from "./NavigationLeftItem";
import { menuItems } from "../../bootstrap/config";
import NavigationLeftSeperator from "./NavigationLeftSeperator";
import { useAppContext } from "../../contexts/AppProvider";

const NavigationLeft = () => {
  const { organizationConfig } = useAppContext();
  const history = useHistory();
  const [activeMenu, setActiveMenu] = useState("/");

  useEffect(() => {
    menuItems.map((menuItem) => {
      if (menuItem.url && history.location.pathname.includes(menuItem.url)) {
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
        {menuItems.map((menuItem) => {
          if (menuItem.type === "seperator") {
            return (
              <NavigationLeftSeperator {...menuItem} key={menuItem.label} />
            );
          } else {
            return (
              <NavigationLeftItem
                {...menuItem}
                isActive={activeMenu === menuItem.url}
                key={menuItem.label}
              />
            );
          }
        })}
      </Box>
    </Flex>
  );
};

export default NavigationLeft;
