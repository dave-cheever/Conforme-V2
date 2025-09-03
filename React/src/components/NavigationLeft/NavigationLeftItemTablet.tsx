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
  
  return (
    <Box
        data-id="030925-97c4ad"
        _hover={{
          cursor: 'pointer',
        }}
        alignItems="center"
        display="flex"
        fontSize="md"
        fontWeight="normal"
        h="42px"
        justifyContent="center"
        mt="5px"
        pos="relative"
        w="auto">
      <Flex data-id="030925-2de382" align="center" h="100%">
        <Flex
          data-id="030925-ab5738"
          align="center"
          bg={
            menuItem.subSections
              ? isPathActive(url)
                ? 'navigationLeftItemTablet.selectedLabelBg'
                : 'navigationLeftItemTablet.unselectedLabelBg'
              : isPathActive(url, { exact: true })
                ? 'navigationLeftItemTablet.selectedLabelBg'
                : 'navigationLeftItemTablet.unselectedLabelBg'
          }
          h="30px"
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
          w="30px">
          <Icon
            data-id="030925-a80fe7"
            as={icon}
            fill="#ffffff"
            h="15px"
            stroke="#ffffff"
            w="15px" />
        </Flex>
      </Flex>
      {filtersOpen && menuItem.url === '/' && (
        <Box
          data-id="030925-0d7dbd"
          bg="white"
          boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)"
          ml="80px"
          pos="absolute"
          py="15px"
          rounded="10px"
          top="0"
          w="235px"
          zIndex="5">
          {Object.keys(responsesStatusesCounts).length !== 0 && (
            <NavigationLeftFilters
              data-id="030925-23f551"
              filter={['all', responsesStatusesCounts.compliant + responsesStatusesCounts.nonCompliant]}
              menuOpen={menuOpen}
              setFiltersOpen={setFiltersOpen} />
          )}
          {Object.entries(responsesStatusesCounts).map((filter) => (
            <NavigationLeftFilters
              data-id="030925-e1d8ff"
              filter={filter}
              key={filter[0]}
              menuOpen={menuOpen}
              setFiltersOpen={setFiltersOpen} />
          ))}
        </Box>
      )}
      {subsectionOpen && menuItem.url === '/admin' && (
        <Box
          data-id="030925-70bb5b"
          bg="white"
          boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)"
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
              data-id="030925-8c3650"
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
    selectedIconStroke: '#ffffff',
    unselectedIconStroke: '#818197',
  },
};
