import { useEffect, useRef, useState } from 'react';

import { Box, Flex, Icon } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import useNavigate from '../../hooks/useNavigate';
import { IMenuItem } from '../../interfaces/IMenu';
import NavigationLeftFilters from './NavigationLeftFilters';
import SubSection from './SubSection';

function NavigationLeftItemTablet({
  menuItem,
  filtersOpen,
  setFiltersOpen,
  subsectionOpen,
  setSubsectionOpen,
}: {
  menuItem: IMenuItem;
  filtersOpen: boolean;
  setFiltersOpen: (value: boolean) => void;
  subsectionOpen: boolean;
  setSubsectionOpen: (value: boolean) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(true);
  const { navigateTo, isPathActive } = useNavigate();
  const { url, icon } = menuItem;
  const { responsesStatusesCounts } = useFiltersContext();
  const boxRef = useRef<HTMLDivElement>(null); 
  
  useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
      if (filtersOpen) setFiltersOpen(false);
      if (subsectionOpen) setSubsectionOpen(false);
    }
  }

  if (filtersOpen || subsectionOpen) 
    document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
  }, [filtersOpen, subsectionOpen, setFiltersOpen, setSubsectionOpen]);

  // Determine background color based on menu item state and path
  const getBackgroundColor = () => {
    const hasSubSections = !!menuItem.subSections;
    const isActive = hasSubSections 
      ? isPathActive(url)
      : isPathActive(url, { exact: true });
    
    return isActive
      ? 'navigationLeftItemTablet.selectedMenuItemBg'
      : 'navigationLeftItemTablet.unselectedMenuItemBg';
  };
  
  return (
    <Box
        _hover={{
          cursor: 'pointer',
        }}
        alignItems="center"
        data-id="000577"
        display="flex"
        fontSize="md"
        fontWeight="normal"
        h="42px"
        justifyContent="center"
        mt="5px"
        pos="relative"
        w="auto">
      <Flex align="center" data-id="000578" h="100%">
        <Flex
          align="center"
          bg={getBackgroundColor()}
          data-id="000579"
          h={["30px", "42px", "30px"]}
          justifyContent="center"
          ml="0px"
          onClick={() => {
            if (menuItem.url === '/') {
              setFiltersOpen(!filtersOpen);
              setSubsectionOpen(false);
              navigateTo(url);
            } else if (menuItem.url === '/admin') {
              setSubsectionOpen(!subsectionOpen);
              setFiltersOpen(false);
            } else {
              setMenuOpen(!menuOpen);
              navigateTo(url);
            }
          }}
          rounded="8px"
          w={["30px", "42px", "30px"]}
          >
          <Icon
            as={icon}
            data-id="000580"
            color="#ffffff"
            fill="#ffffff"
            h={["15px", '18px', '15px']}
            stroke="#ffffff"
            w={["15px", '18px', '15px']} />
        </Flex>
      </Flex>
      {filtersOpen && menuItem.url === '/' && (
        <Box
          bg="white"
          boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)"
          data-id="000581"
          ml="80px"
          pos="absolute"
          py="15px"
          rounded="10px"
          top="0"
          w="235px"
          zIndex="5">
          {Object.keys(responsesStatusesCounts).length !== 0 && (
            <NavigationLeftFilters
              data-id="000582"
              filter={['all', responsesStatusesCounts.compliant + responsesStatusesCounts.nonCompliant]}
              menuOpen={menuOpen}
              setFiltersOpen={setFiltersOpen} />
          )}
          {Object.entries(responsesStatusesCounts).map((filter) => (
            <NavigationLeftFilters
              data-id="000583"
              filter={filter}
              key={filter[0]}
              menuOpen={menuOpen}
              setFiltersOpen={setFiltersOpen} />
          ))}
        </Box>
      )}
      {subsectionOpen && menuItem.url === '/admin' && (
        <Box
          bg="white"
          boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)"
          data-id="000584"
          maxH={`calc(100vh - ${menuItem.subSections.length * 40}px)`}
          ml="18rem"
          overflowY="auto"
          pos="absolute"
          py="15px"
          ref={boxRef}
          rounded="10px"
          top="0"
          w="235px"
          zIndex="11">
          {menuItem.subSections?.map((subSection) => (
            <SubSection
              data-id="000585"
              isPopover
              key={subSection.label}
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              subsection={subSection} />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default NavigationLeftItemTablet;

export const navigationLeftItemTabletStyles = {
  navigationLeftItemTablet: {
    selectedMenuItem: '#1F1F1F',
    unselectedMenuItem: '#818197',
    selectedLabelBg: '#462AC4',
    unselectedLabelBg: '#DDDDDD',
    selectedMenuItemBg: '#0068A3',
    unselectedMenuItemBg: '#01173E',
    selectedIconStroke: '#ffffff',
    unselectedIconStroke: '#818197',
  },
};
