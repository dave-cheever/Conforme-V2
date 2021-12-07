import React from 'react';
import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import { useHistory } from 'react-router';

import { IMenuItem } from '../../interfaces/IMenu';
import NavigationLeftFilters from '../NavigationLeft/NavigationLeftFilters';
import { ArrowRight } from '../../icons';
import SubSection from '../NavigationLeft/SubSection';

const NavigationBottomItem = ({ 
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
  const history = useHistory();
  const { url, icon, label } = menuItem;
  const filtersCount = {compliant: 0, nonCompliant: 2, comingUp: 2};

  return (
    <Flex 
      alignItems="center"
      pos="relative"
      css={{
        ":not(:first-child)": {
          marginLeft: "25px"
        }
      }}
      flexGrow={
        menuItem.subSections
          ? history.location.pathname.includes(url)
            ? 1
            : 0
          : history.location.pathname === url
            ? 1
            : 0
      } 
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
      <Flex 
        w="30px" 
        h="30px" 
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
      {((menuItem.subSections && history.location.pathname.includes(url)) || (!menuItem.subSections && history.location.pathname === url)) &&
        <>
          <Text ml="15px" color="#818197" fontSize="11px">{label}</Text>
          <ArrowRight boxSize="10px" stroke="#818197" ml="15px" transform="rotate(270deg)" />
        </>
      }
      {
        filtersOpen && menuItem.url === "/" &&
        <Box w="220px" bg="white" py="15px" left="0" pos="absolute" bottom="45px" zIndex="5" rounded="10px" boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)">
          {Object.keys(filtersCount).length !== 0 && <NavigationLeftFilters filter={["all", filtersCount["compliant"] + filtersCount["nonCompliant"]]} setFiltersOpen={setFiltersOpen} />}
          {Object.entries(filtersCount).map((filter) => <NavigationLeftFilters key={filter[0]} filter={filter} setFiltersOpen={setFiltersOpen} />)}
        </Box>
      }
      {
        subsectionOpen && menuItem.url === "/admin" &&
        <Box 
          w="235px" 
          bg="white" 
          py="15px" 
          left={
            menuItem.subSections
              ? history.location.pathname.includes(url)
                ? "0"
                : "-200px"
              : history.location.pathname === url
                ? "0"
                : "-200px"
          }
          pos="absolute" 
          bottom="45px" 
          zIndex="5" 
          rounded="10px" 
          boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)"
        >
          {menuItem.subSections?.map((subSection) => {
            return <SubSection key={subSection.label} subsection={subSection} />;
          })}
        </Box>
      }
    </Flex>
  );
};

export default NavigationBottomItem;
