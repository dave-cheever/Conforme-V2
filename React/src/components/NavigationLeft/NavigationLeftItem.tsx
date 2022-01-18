import { useState } from "react";
import { Box, Icon, Flex } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

import SubSection from "./SubSection";
import NavigationLeftFilters from "./NavigationLeftFilters";
import { useFiltersContext } from "../../contexts/FiltersProvider";
import { ArrowRight } from "../../icons";
import { IMenuItem } from "../../interfaces/IMenu";

const NavigationLeftItem = ({ menuItem }: { menuItem: IMenuItem }) => {
  const history = useHistory();
  const { url, icon, label } = menuItem;
  const [menuOpen, setMenuOpen] = useState(true);

  const {
    showFiltersPanel,
    responsesStatusesCounts,
  } = useFiltersContext();

  return (
    <>
      <Box
        w="240px"
        h="42px"
        mt="5px"
        display="flex"
        pos="relative"
        alignItems="center"
        fontSize="md"
        fontWeight="normal"
        _hover={{
          cursor: "pointer"
        }}
        onClick={() => {
          setMenuOpen(!menuOpen);
          if (menuItem.subSections) {
            history.push(menuItem.subSections[0].url);
          } else {
            history.push(url);
          }
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
                  ? "navigationLeftItem.selectedLabelBg"
                  : "navigationLeftItem.unselectedLabelBg"
                : history.location.pathname === url
                  ? "navigationLeftItem.selectedLabelBg"
                  : "navigationLeftItem.unselectedLabelBg"
            }
            rounded="8px"
          >
            <Icon
              w="15px"
              h="15px"
              as={icon}
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
          {(showFiltersPanel && (menuItem.subSections?.length > 0 || (history.location.pathname === "/" && history.location.pathname === url)))
            && <ArrowRight boxSize="10px" ml={1} />
          }
        </Flex>
        {!showFiltersPanel && <Box
          ml="5"
          fontWeight="400"
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
          {!showFiltersPanel && label}
        </Box>
        }
      </Box>
      <Box>
        {history.location.pathname.includes(url) && !showFiltersPanel &&
          menuItem.subSections?.map((subSection) => {
            return <SubSection key={subSection.label} subsection={subSection} setMenuOpen={setMenuOpen} menuOpen={menuOpen} />;
          })
        }
        {history.location.pathname === "/" && history.location.pathname === url && !showFiltersPanel &&
          <>
            {Object.keys(responsesStatusesCounts).length !== 0 &&
              <NavigationLeftFilters filter={["all", responsesStatusesCounts["compliant"] + responsesStatusesCounts["nonCompliant"]]} menuOpen={menuOpen} />}
            {Object.entries(responsesStatusesCounts).map((filter) => <NavigationLeftFilters key={filter[0]} filter={filter} menuOpen={menuOpen} />)}
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
};
