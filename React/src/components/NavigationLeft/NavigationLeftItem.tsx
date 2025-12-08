import { useState, useEffect } from 'react';

import { Box, Collapse, Flex, Icon } from '@chakra-ui/react';
import { capitalize } from 'lodash';

import { useAppContext } from '../../contexts/AppProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import useNavigate from '../../hooks/useNavigate';
import DropdownArrowIcon from '../../icons/DropdownArrowIcon';
import { IMenuItem } from '../../interfaces/IMenu';
import Can from '../can';
import NavigationLeftFilters from './NavigationLeftFilters';
import SubSection from './SubSection';

function NavigationLeftItem({ menuItem }: { menuItem: IMenuItem }) {
  const { module } = useAppContext();
  const isTrackerComponent = module?.type === "tracker";
  const { navigateTo, isPathActive } = useNavigate();
  const { url, icon, label } = menuItem;
  // Initialize menuOpen based on whether current path matches any subSection
  const [menuOpen, setMenuOpen] = useState(() => {
    if (menuItem.subSections && menuItem.subSections.length > 0) {
      return menuItem.subSections.some(subSection => isPathActive(subSection.url, { exact: true }));
    }
    return false;
  });
  const { responsesStatusesCounts } = useFiltersContext();

  // Keep menu open when navigating to a subSection
  useEffect(() => {
    if (menuItem.subSections && menuItem.subSections.length > 0) {
      const shouldBeOpen = menuItem.subSections.some(subSection => isPathActive(subSection.url, { exact: true }));
      if (shouldBeOpen && !menuOpen) {
        setMenuOpen(true);
      }
    }
  }, [menuItem.subSections, isPathActive, menuOpen]);

  // Helper function to determine if menu item is selected
  // For items with subSections: selected if menu is open OR any subSection is active OR path matches
  // For items without subSections: selected if path matches exactly
  const isMenuItemSelected = () => {
    if (menuItem.subSections && menuItem.subSections.length > 0) {
      // Check if any subSection is active
      const hasActiveSubSection = menuItem.subSections.some(subSection => 
        isPathActive(subSection.url, { exact: true })
      );
      // Selected if: menu is open OR any subSection is active OR path matches
      return menuOpen || hasActiveSubSection || isPathActive(url);
    }
    return isPathActive(url, { exact: true });
  };

  const isSelected = isMenuItemSelected();

  return (
    <>
      <Box
        _hover={{
          cursor: 'pointer',
          bg: isSelected ? undefined : 'navigationLeftItem.hoverLabelBg',
        }}
        alignItems="center"
        bg={isSelected 
          ? 'navigationLeftItem.selectedMenuItemBg'
          : 'navigationLeftItem.unselectedMenuItemBg'}
        borderRadius={"6px"}
        data-id="000559"
        display="flex"
        fontSize="md"
        fontWeight="normal"
        px="14px"
        py="12px"
        h="42px"
        mt="5px"
        sx={{
          '&:hover': isSelected ? {} : { backgroundColor: 'navigationLeftItem.hoverLabelBg' },
        }}
        onClick={() => {
          if (menuItem.subSections && menuItem.subSections.length > 0) {
            setMenuOpen(!menuOpen);
          } else {
            navigateTo(url);
          }
        }}
        pos="relative"
        transition="all 0.2s ease-out"
        w="250px"
      >
        <Flex align="center" data-id="000560" h="100%" justify="space-between">
          <Flex data-id="002744" align="center">
            <Flex
              alignItems="center"
              bg={'transparent'}
              data-id="000561"
              h="30px"
              justifyContent="center"
              rounded="8px"
              transition="all 0.2s ease-out"
              w="30px"
              >
              <Icon
                as={icon}
                color="#fff"
                data-id="000562"
                fill="#ffffff"
                h="18px"
                stroke="#ffffff"
                w="18px" />
            </Flex>
          </Flex>
        </Flex>
        <Flex
          align="center"
          data-id="000564"
          justify="space-between"
          w="100%">
          <Box
            data-id="002745"
            color={isSelected
              ? 'navigationLeftItem.selectedMenuItem'
              : 'navigationLeftItem.unselectedMenuItem'}
            fontWeight="600"
            fontSize={'16px'}
            ml="8px">
            {capitalize(label)}
          </Box>

          {/* Show dropdown arrow for menu items with sub-sections - positioned on far right */}
          {menuItem.subSections && menuItem.subSections.length > 0 && (
            <DropdownArrowIcon
              data-id="002746"
              dataId="000571"
              fill="white"
              height="19px"
              width="18px"
              style={{
                transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease-in-out',
              }} />
          )}
        </Flex>
      </Box>
      {/* Sub-menu items with collapse */}
      {menuItem.subSections && menuItem.subSections.length > 0 && (
        <Collapse data-id="002747" in={menuOpen} animateOpacity>
          <Box marginTop={'12px'} data-id="000565">
            {menuItem.subSections?.map((subSection) => {
              if (subSection.permission) {
                return (
                  <Can
                    action={subSection.permission}
                    data-id="000566"
                    key={subSection.url}
                    // eslint-disable-next-line react/no-unstable-nested-components
                    yes={() => <SubSection
                      data-id="000567"
                      key={subSection.label}
                      menuOpen={menuOpen}
                      setMenuOpen={setMenuOpen}
                      subsection={subSection} />} />
                );
              }
              return (
                <SubSection
                  data-id="000568"
                  key={subSection.label}
                  menuOpen={menuOpen}
                  setMenuOpen={setMenuOpen}
                  subsection={subSection} />
              );
            })}
          </Box>
        </Collapse>
      )}
      {/* Filters - always visible when on tracker items page (dashboard) */}
      {isPathActive(url, { exact: true }) && isTrackerComponent && url === '/dashboard' && responsesStatusesCounts && (
        <Box marginTop={'12px'} data-id="000571">
          {Object.keys(responsesStatusesCounts).length !== 0 && (
            <NavigationLeftFilters
              data-id="000569"
              filter={['all', responsesStatusesCounts.compliant + responsesStatusesCounts.nonCompliant]}
              menuOpen={true} />
          )}
          {Object.entries(responsesStatusesCounts).map((filter) => (
            <NavigationLeftFilters
              data-id="000570"
              filter={filter}
              key={filter[0]}
              menuOpen={true} />
          ))}
        </Box>
      )}
    </>
  );
}

export default NavigationLeftItem;

export const navigationLeftItemStyles = {
  navigationLeftItem: {
    selectedMenuItem: '#ffffff',
    unselectedMenuItem: '#ffffff',
    selectedLabelBg: '#0068A3',
    selectedMenuItemBg: '#0068A3',
    unselectedMenuItemBg: '#01173E',
    unselectedLabelBg: '#01173E',
    hoverLabelBg: '#2A3B6C',
    selectedIconStroke: '#ffffff',
    unselectedIconStroke: '#818197',
  },
};
