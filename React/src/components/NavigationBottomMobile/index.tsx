import React, { useState } from "react";
import { Flex } from "@chakra-ui/react";

import Can from "./../can";
import { menuItems } from "../../bootstrap/config";
import NavigationBottomItem from "./NavigationBottomItem";

const NavigationBottomMobile = () => {
  const [subsectionOpen, setSubsectionOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <Flex h="60px" position="fixed" bottom="0px" w="full" bg="navigationBottomMobile.bg" p="15px 25px">
      {menuItems.map((menuItem: any, i) => (
        <Can
          key={`menu${i}`}
          action={menuItem.permission}
          yes={() => (
            <NavigationBottomItem 
              menuItem={menuItem} 
              filtersOpen={filtersOpen}
              setFiltersOpen={setFiltersOpen}
              subsectionOpen={subsectionOpen}
              setSubsectionOpen={setSubsectionOpen}
            />
          )}
        />
      ))}
    </Flex>
  );
};

export default NavigationBottomMobile;

export const navigationBottomMobileStyles = {
  navigationBottomMobile: {
    bg: "#FFFFFF",
  },
};
