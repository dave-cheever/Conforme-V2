import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Box, Flex, Text, Icon } from "@chakra-ui/react";

import { menuItems } from "../../bootstrap/config";
import Can from "../can";
import { useFiltersContext } from "../../contexts/FiltersProvider";
import NavigationLeftItem from "./NavigationLeftItem";
import { Conforme } from "../../icons";

const NavigationLeft = () => {
  const history = useHistory();
  const {
    cleanFilters
  } = useFiltersContext();

  useEffect(() => {    
    if (!(history.location.pathname === '/' || history.location.pathname.includes('/items'))) {
      cleanFilters();
    }
    // eslint-disable-next-line 
  }, [history.location.pathname]);

  return (
    <>
      <Box h="100vh" bg="navigationLeft.bg" fontWeight="semibold" w={["70px", "70px", "240px"]} display={["none", "block"]}>
        <Box
          display="flex"
          alignItems="center"
          h="80px"
          onClick={() => history.push('/')}
          cursor="pointer"
        >
          <Text
            w="80px"
            ml="25px"
            fontWeight="700"
            fontSize="16px"
            color="navigationLeft.organizationNameFontColor"
          >
            Gloratio
          </Text>
        </Box>
        <Flex direction="column" justify="space-between" h="calc(100% - 80px)">
          <Box>
            {menuItems.map((menuItem: any, i) => (
              <Can
                key={`menu${i}`}
                action={menuItem.permission}
                yes={() => <NavigationLeftItem menuItem={menuItem} />}
              />
            ))}
          </Box>
        <Icon as={Conforme} w="103px" h="35px" ml="25px" mb="20px" />
        </Flex>
      </Box>
    </>
  );
};

export default NavigationLeft;

export const navigationLeftStyles = {
  navigationLeft: {
    bg: "#E5E5E5",
    organizationNameFontColor: "#282F36"
  }
}
