import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Box, Flex, Text, Icon } from "@chakra-ui/react";

import { menuItems } from "../../bootstrap/config";
import Can from "../can";
import { useFiltersContext } from "../../contexts/FiltersProvider";
import NavigationLeftItem from "./NavigationLeftItem";
import { Conforme, ConformeSmall } from "../../icons";

const NavigationLeft = () => {
  const history = useHistory();
  const {
    cleanFilters,
    showFiltersPanel
  } = useFiltersContext();
  const [ subsectionOpen, setSubsectionOpen ] = useState(false);
  const [ filtersOpen, setFiltersOpen ] = useState(false);

  useEffect(() => {    
    if (!(history.location.pathname === '/' || history.location.pathname.includes('/items'))) {
      cleanFilters();
    }
    // eslint-disable-next-line 
  }, [history.location.pathname]);

  const organizationName = "Gloratio"

  return (
    <>
      <Box h="100vh" bg="navigationLeft.bg" fontWeight="semibold" w={showFiltersPanel ? ["0px","80px","80px"] : ["0px","80px","240px"]} display={["none","block", "block"]}>
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
            fontWeight="bold"
            fontSize="16px"
            color="navigationLeft.organizationNameFontColor"
          >
            {showFiltersPanel ? organizationName.charAt(0): organizationName }
          </Text>
        </Box>
        <Flex direction="column" justify="space-between" h="calc(100% - 80px)">
          <Box>
            {menuItems.map((menuItem: any, i) => (
              <Can
                key={`menu${i}`}
                action={menuItem.permission}
                yes={() => 
                  <NavigationLeftItem 
                    menuItem={menuItem} 
                    filtersOpen={filtersOpen} 
                    setFiltersOpen={setFiltersOpen} 
                    subsectionOpen={subsectionOpen}
                    setSubsectionOpen={setSubsectionOpen}
                  />}
              />
            ))}
          </Box>
        <Icon as={showFiltersPanel ? ConformeSmall: Conforme} w={showFiltersPanel?"27px":"103px"} h="30px" ml="20px" mb="20px" />
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
