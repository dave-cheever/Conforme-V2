import { useState } from 'react';

import { Box, Flex, Icon } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import useNavigate from '../../hooks/useNavigate';
import { ArrowRight } from '../../icons';
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

  return (<Box
      _hover={{
        cursor: 'pointer',
      }}
      alignItems="center"
      data-id="0f891525846d"
      display="flex"
      fontSize="md"
      fontWeight="normal"
      h="42px"
      mt="5px"
      pos="relative"
      w="90px">
      <Flex align="center" data-id="2291e781bcb4" h="100%">
        <Flex
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
          data-id="47645b188bad"
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
            as={icon}
            data-id="27c25f1d5d16"
            fill="#ffffff"
            h="15px"
            stroke="#ffffff"
            w="15px" />
        </Flex>
        {menuItem.subSections && <ArrowRight
          boxSize="10px"
          data-id="e41a549dfe3c"
          ml="10px"
          stroke="#818197"
          viewBox="0 0 10 10" />}
      </Flex>
      {filtersOpen && menuItem.url === '/' && (
        <Box
          bg="white"
          boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)"
          data-id="dcd4f2603e3a"
          ml="80px"
          pos="absolute"
          py="15px"
          rounded="10px"
          top="0"
          w="235px"
          zIndex="5">
          {Object.keys(responsesStatusesCounts).length !== 0 && (
            <NavigationLeftFilters
              data-id="c3677a2169ad"
              filter={['all', responsesStatusesCounts.compliant + responsesStatusesCounts.nonCompliant]}
              menuOpen={menuOpen}
              setFiltersOpen={setFiltersOpen} />
          )}
          {Object.entries(responsesStatusesCounts).map((filter) => (
            <NavigationLeftFilters
              data-id="b8473be32eb4"
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
          data-id="c7dad1258a0f"
          maxH={`calc(100vh - ${menuItem.subSections.length * 40}px)`}
          ml="80px"
          overflowY="auto"
          pos="absolute"
          py="15px"
          rounded="10px"
          top="0"
          w="235px"
          zIndex="11">
          {menuItem.subSections?.map((subSection) => (
            <SubSection
              data-id="3b7e67504e5a"
              isPopover
              key={subSection.label}
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              subsection={subSection} />
          ))}
        </Box>
      )}
    </Box>);
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
