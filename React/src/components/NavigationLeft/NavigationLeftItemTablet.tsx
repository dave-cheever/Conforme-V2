import {  useState } from "react";
import { Box, Icon, Flex } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

import SubSection from "./SubSection";
import NavigationLeftFilters from "./NavigationLeftFilters";
import { ArrowRight } from "../../icons";
import { IMenuItem } from "../../interfaces/IMenu";

const NavigationLeftItemTablet = ({ 
  menuItem, 
  filtersOpen, 
  setFiltersOpen, 
  subsectionOpen, 
  setSubsectionOpen 
} : {
  menuItem: IMenuItem, 
  filtersOpen: boolean, 
  setFiltersOpen: (value: boolean) => void, 
  subsectionOpen: boolean, 
  setSubsectionOpen: (value: boolean) => void
}) => {
  const [menuOpen, setMenuOpen] = useState(true);
  const history = useHistory();
  const filtersCount = {compliant: 0, nonCompliant: 2, comingUp: 2};
  const { url, icon } = menuItem;

  return (
    <>
      <Box
        h="42px"
        w="90px"
        mt="5px"
        display="flex"
        pos="relative"
        alignItems="center"
        fontSize="md"
        fontWeight="normal"
        _hover={{
          cursor: "pointer"
        }}
      >
        <Flex h="100%" align="center">
          <Flex 
            w="30px" 
            h="30px" 
            ml="25px"
            alignItems="center" 
            justifyContent="center"
            bg={
              menuItem.subSections
                ? history.location.pathname.includes(url)
                  ? "navigationLeftItemTablet.selectedLabelBg"
                  : "navigationLeftItemTablet.unselectedLabelBg"
                : history.location.pathname === url
                  ? "navigationLeftItemTablet.selectedLabelBg"
                  : "navigationLeftItemTablet.unselectedLabelBg"
            }  
            rounded="8px" 
            onClick={() => {
              if(menuItem.url === "/") {
                setFiltersOpen(!filtersOpen);
                setSubsectionOpen(false);
                history.push(url);
              } else if (menuItem.url === "/admin") {
                setSubsectionOpen(!subsectionOpen);
                setFiltersOpen(false);
              }
            }}
          >
            <Icon
              as={icon}
              w="15px"
              h="15px"
              stroke={
                menuItem.subSections
                  ? history.location.pathname.includes(url)
                    ? "navigationLeftItemTablet.selectedIconStroke"
                    : "navigationLeftItemTablet.unselectedIconStroke"
                  : history.location.pathname === url
                    ? "navigationLeftItemTablet.selectedIconStroke"
                    : "navigationLeftItemTablet.unselectedIconStroke"
              }
            />
          </Flex>
          <ArrowRight boxSize="10px" stroke="#818197" ml="10px" />
        </Flex>
        {
          filtersOpen && menuItem.url === "/" &&
          <Box w="235px" bg="white" py="15px" ml="80px" pos="absolute" top="0" zIndex="5" rounded="10px" boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)">
            {Object.keys(filtersCount).length !== 0 && <NavigationLeftFilters filter={["all", filtersCount["compliant"] + filtersCount["nonCompliant"]]} menuOpen={menuOpen} setFiltersOpen={setFiltersOpen} />}
            {Object.entries(filtersCount).map((filter) => <NavigationLeftFilters key={filter[0]} filter={filter} menuOpen={menuOpen} setFiltersOpen={setFiltersOpen} />)}
          </Box>
        }
        {
          subsectionOpen && menuItem.url === "/admin" &&
          <Box w="235px" bg="white" py="15px" ml="80px" pos="absolute" top="0" zIndex="5" rounded="10px" boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)">
            {menuItem.subSections?.map((subSection) => {
              return <SubSection key={subSection.label} subsection={subSection} setMenuOpen={setMenuOpen} menuOpen={menuOpen}/>;
            })}
          </Box>
        }
      </Box>
    </>
  )
};

export default NavigationLeftItemTablet;

export const navigationLeftItemTabletStyles = {
  navigationLeftItemTablet: {
    selectedMenuItem: "#1F1F1F",
    unselectedMenuItem: "#818197",
    selectedLabelBg: "#462AC4",
    unselectedLabelBg: "#ffffff",
    selectedIconStroke: "#ffffff",
    unselectedIconStroke: "#818197",
  }
};
