import {  useState } from "react";
import { Box, Icon, Flex } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

import SubSection from "./SubSection";
import NavigationLeftFilters from "./NavigationLeftFilters";
import { useFiltersContext } from "../../contexts/FiltersProvider";
import { ChevronRight } from "../../icons";
import useDevice from "../../hooks/useDevice";

const NavigationLeftItem = ({menuItem, filtersOpen, setFiltersOpen, subsectionOpen, setSubsectionOpen }) => {
  const [menuOpen, setMenuOpen] = useState(true);
  const history = useHistory();
  const filtersCount = {compliant: 0, nonCompliant: 2, comingUp: 2}
  const { url, icon, label } = menuItem;
  const device = useDevice();

  const {
    showFiltersPanel
  } = useFiltersContext();

  return (
    <>
      <Box
        display="flex"
        pos="relative"
        h="42px"
        mt="5px"
        alignItems="center"
        fontSize="md"
        fontWeight="normal"
        _hover={{
          cursor: "pointer"
        }}
        w={[0, "90px", "240px"]}
        onClick={() => {
          setMenuOpen(!menuOpen);
          if (menuItem.subSections && device === "desktop") {
            history.push(menuItem.subSections[0].url);
          } else if (device === "desktop") {
            history.push(url);
          }
        }}
      >
        <Flex h="100%" align="center">
          <Flex 
            bg={
              menuItem.subSections
                ? history.location.pathname.includes(url)
                  ? "navigationLeftItem.selectedLabelBg"
                  : "navigationLeftItem.unselectedLabelBg"
                : history.location.pathname === url
                  ? "navigationLeftItem.selectedLabelBg"
                  : "navigationLeftItem.unselectedLabelBg"
            } 
            w="30px" 
            h="30px" 
            ml="25px" 
            rounded="8px" 
            alignItems="center" 
            justifyContent="center"
            onClick={() => {
              if(menuItem.url === "/" && device === "tablet") {
                setFiltersOpen(!filtersOpen);
                setSubsectionOpen(false);
                history.push(url);
              } else if (menuItem.url === "/admin" && device === "tablet") {
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
                    ? "navigationLeftItem.selectedIconStroke"
                    : "navigationLeftItem.unselectedIconStroke"
                  : history.location.pathname === url
                    ? "navigationLeftItem.selectedIconStroke"
                    : "navigationLeftItem.unselectedIconStroke"
              }
            />
          </Flex>
          { (showFiltersPanel && (menuItem.subSections?.length > 0 || (history.location.pathname === "/" && history.location.pathname === url) )) && <ChevronRight color="navigationLeftItem.unselectedMenuItem" boxSize="10px" ml={1}/>}
        </Flex>
        {!showFiltersPanel && <Box
          ml="5"
          fontWeight="400"
          display={["block", "none", "block"]}
          color={
            menuItem.subSections
              ? history.location.pathname.includes(url)
                ? "navigationLeftItem.selectedMenuItem"
                : "navigationLeftItem.unselectedMenuItem"
              : history.location.pathname === url
                ? "navigationLeftItem.selectedMenuItem"
                : "navigationLeftItem.unselectedMenuItem"
          }
        >
          {label}
        </Box>}
        {
          device === "tablet" && filtersOpen && menuItem.url === "/" &&
          <Box w="235px" bg="white" ml="80px" pos="absolute" top="0" zIndex="5" rounded="10px">
            {Object.keys(filtersCount).length !== 0 && <NavigationLeftFilters filter={["all", filtersCount["compliant"] + filtersCount["nonCompliant"]]} menuOpen={menuOpen} setFiltersOpen={setFiltersOpen} />}
            {Object.entries(filtersCount).map((filter) => <NavigationLeftFilters key={filter[0]} filter={filter} menuOpen={menuOpen} setFiltersOpen={setFiltersOpen} />)}
          </Box>
        }
        {
          device === "tablet" && subsectionOpen && menuItem.url === "/admin" &&
          <Box w="235px" bg="white" ml="80px" pos="absolute" top="0" zIndex="5" rounded="10px">
            {menuItem.subSections?.map((subSection) => {
              return <SubSection key={subSection.label} subsection={subSection} setMenuOpen={setMenuOpen} menuOpen={menuOpen}/>;
            })}
          </Box>
        }
      </Box>
      <Box display={["block", "none", "block"]}>
        {history.location.pathname.includes(url) && !showFiltersPanel &&
          menuItem.subSections?.map((subSection) => {
            return <SubSection key={subSection.label} subsection={subSection} setMenuOpen={setMenuOpen} menuOpen={menuOpen}/>;
          })}
        {history.location.pathname === "/" && history.location.pathname === url  && !showFiltersPanel && <>
          {Object.keys(filtersCount).length !== 0 && <NavigationLeftFilters filter={["all", filtersCount["compliant"] + filtersCount["nonCompliant"]]} menuOpen={menuOpen} setFiltersOpen={setFiltersOpen} />}
          {Object.entries(filtersCount).map((filter) => <NavigationLeftFilters key={filter[0]} filter={filter} menuOpen={menuOpen} setFiltersOpen={setFiltersOpen} />)}
        </>
        }
      </Box>
    </>
  )
};

export default NavigationLeftItem;

export const navigationLeftItemStyles = {
  navigationLeftItem: {
    selectedMenuItem: "#1F1F1F",
    unselectedMenuItem: "#818197",
    selectedLabelBg: "#462AC4",
    unselectedLabelBg: "#ffffff",
    selectedIconStroke: "#ffffff",
    unselectedIconStroke: "#818197",
  }
}