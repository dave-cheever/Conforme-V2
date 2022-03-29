import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Box, Flex, Icon } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import { ArrowRight } from '../../icons';
import { IMenuItem } from '../../interfaces/IMenu';
import NavigationLeftFilters from './NavigationLeftFilters';
import SubSection from './SubSection';

const NavigationLeftItemTablet = ({
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
}) => {
  const [menuOpen, setMenuOpen] = useState(true);
  const history = useHistory();
  const { url, icon } = menuItem;
  const { responsesStatusesCounts } = useFiltersContext();

  return (
    <>
      <Box
        _hover={{
          cursor: 'pointer',
        }}
        alignItems="center"
        display="flex"
        fontSize="md"
        fontWeight="normal"
        h="42px"
        mt="5px"
        pos="relative"
        w="90px"
      >
        <Flex align="center" h="100%">
          <Flex
            alignItems="center"
            bg={
              menuItem.subSections
                ? history.location.pathname.includes(url)
                  ? 'navigationLeftItemTablet.selectedLabelBg'
                  : 'navigationLeftItemTablet.unselectedLabelBg'
                : history.location.pathname === url
                ? 'navigationLeftItemTablet.selectedLabelBg'
                : 'navigationLeftItemTablet.unselectedLabelBg'
            }
            h="30px"
            justifyContent="center"
            ml="25px"
            onClick={() => {
              if (menuItem.url === '/') {
                setFiltersOpen(!filtersOpen);
                setSubsectionOpen(false);
                history.push(url);
              } else if (menuItem.url === '/admin') {
                setSubsectionOpen(!subsectionOpen);
                setFiltersOpen(false);
              }
            }}
            rounded="8px"
            w="30px"
          >
            <Icon
              as={icon}
              h="15px"
              stroke={
                menuItem.subSections
                  ? history.location.pathname.includes(url)
                    ? 'navigationLeftItemTablet.selectedIconStroke'
                    : 'navigationLeftItemTablet.unselectedIconStroke'
                  : history.location.pathname === url
                  ? 'navigationLeftItemTablet.selectedIconStroke'
                  : 'navigationLeftItemTablet.unselectedIconStroke'
              }
              w="15px"
            />
          </Flex>
          <ArrowRight boxSize="10px" ml="10px" stroke="#818197" />
        </Flex>
        {filtersOpen && menuItem.url === '/' && (
          <Box
            bg="white"
            boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)"
            ml="80px"
            pos="absolute"
            py="15px"
            rounded="10px"
            top="0"
            w="235px"
            zIndex="5"
          >
            {Object.keys(responsesStatusesCounts).length !== 0 && (
              <NavigationLeftFilters
                filter={[
                  'all',
                  responsesStatusesCounts.compliant +
                    responsesStatusesCounts.nonCompliant,
                ]}
                menuOpen={menuOpen}
                setFiltersOpen={setFiltersOpen}
              />
            )}
            {Object.entries(responsesStatusesCounts).map((filter) => (
              <NavigationLeftFilters
                filter={filter}
                key={filter[0]}
                menuOpen={menuOpen}
                setFiltersOpen={setFiltersOpen}
              />
            ))}
          </Box>
        )}
        {subsectionOpen && menuItem.url === '/admin' && (
          <Box
            bg="white"
            boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)"
            ml="80px"
            pos="absolute"
            py="15px"
            rounded="10px"
            top="0"
            w="235px"
            zIndex="5"
          >
            {menuItem.subSections?.map((subSection) => (
              <SubSection
                key={subSection.label}
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
                subsection={subSection}
              />
            ))}
          </Box>
        )}
      </Box>
    </>
  );
};

export default NavigationLeftItemTablet;

export const navigationLeftItemTabletStyles = {
  navigationLeftItemTablet: {
    selectedMenuItem: '#1F1F1F',
    unselectedMenuItem: '#818197',
    selectedLabelBg: '#462AC4',
    unselectedLabelBg: '#ffffff',
    selectedIconStroke: '#ffffff',
    unselectedIconStroke: '#818197',
  },
};
