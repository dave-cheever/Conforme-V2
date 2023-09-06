import { useState } from 'react';

import { Box, Flex, Icon } from '@chakra-ui/react';
import { capitalize } from 'lodash';

import { useAppContext } from '../../contexts/AppProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import useNavigate from '../../hooks/useNavigate';
import { ArrowRight } from '../../icons';
import { IMenuItem } from '../../interfaces/IMenu';
import Can from '../can';
import NavigationLeftFilters from './NavigationLeftFilters';
import SubSection from './SubSection';

function NavigationLeftItem({ menuItem }: { menuItem: IMenuItem }) {
  const { organizationConfig } = useAppContext();
  const isTrackerComponent = organizationConfig?.modules.find(({ type }) => type === 'tracker');
  const { navigateTo, isPathActive } = useNavigate();
  const { url, icon, label } = menuItem;
  const [menuOpen, setMenuOpen] = useState(true);
  const { showFiltersPanel, responsesStatusesCounts } = useFiltersContext();

  return (<>
    <Box
      _hover={{
        cursor: 'pointer',
      }}
      alignItems="center"
      data-id="b44d50f8ecb0"
      display="flex"
      fontSize="md"
      fontWeight="normal"
      h="42px"
      mt="5px"
      onClick={() => {
        setMenuOpen(!menuOpen);
        if (menuItem.subSections) navigateTo(menuItem.subSections[0].url);
        else navigateTo(url);
      }}
      pos="relative"
      w="240px">
      <Flex align="center" data-id="ae4bc8aaeef4" h="100%">
        <Flex
          alignItems="center"
          bg={
            menuItem.subSections
              ? isPathActive(url)
                ? 'navigationLeftItem.selectedLabelBg'
                : 'navigationLeftItem.unselectedLabelBg'
              : isPathActive(url, { exact: true })
                ? 'navigationLeftItem.selectedLabelBg'
                : 'navigationLeftItem.unselectedLabelBg'
          }
          data-id="640122fb3b87"
          h="30px"
          justifyContent="center"
          ml="25px"
          rounded="8px"
          w="30px">
          <Icon
            as={icon}
            data-id="0d8ef485e550"
            fill={
              menuItem.url == '/answers'
                ? menuItem.subSections
                  ? isPathActive(url)
                    ? 'navigationLeftItem.selectedIconStroke'
                    : 'navigationLeftItem.unselectedIconStroke'
                  : isPathActive(url, { exact: true })
                    ? 'navigationLeftItem.selectedIconStroke'
                    : 'navigationLeftItem.unselectedIconStroke'
                : ''
            }
            h="15px"
            stroke={
              menuItem.url != '/answers'
                ? menuItem.subSections
                  ? isPathActive(url)
                    ? 'navigationLeftItem.selectedIconStroke'
                    : 'navigationLeftItem.unselectedIconStroke'
                  : isPathActive(url, { exact: true })
                    ? 'navigationLeftItem.selectedIconStroke'
                    : 'navigationLeftItem.unselectedIconStroke'
                : ''
            }
            w="15px" />
        </Flex>
        {showFiltersPanel && (menuItem.subSections?.length > 0 || isPathActive(url, { exact: true })) && (
          <ArrowRight boxSize="10px" data-id="9cbeca74411a" ml={1} />
        )}
      </Flex>
      {!showFiltersPanel && (
        <Box
          color={
            menuItem.subSections
              ? isPathActive(url)
                ? 'navigationLeftItem.selectedMenuItem'
                : 'navigationLeftItem.unselectedMenuItem'
              : isPathActive(url, { exact: true })
                ? 'navigationLeftItem.selectedMenuItem'
                : 'navigationLeftItem.unselectedMenuItem'
          }
          data-id="0c5a4e0c95fc"
          fontWeight="400"
          ml="5">
          {!showFiltersPanel && capitalize(label)}
        </Box>
      )}
    </Box>
    <Box data-id="8299a43a547f">
      {isPathActive(url) &&
        !showFiltersPanel &&
        menuItem.subSections?.map((subSection) => {
          if (subSection.permission) {
            return (
              (<Can
                action={subSection.permission}
                data-id="e1a086b588f1"
                key={subSection.url}
                // eslint-disable-next-line react/no-unstable-nested-components
                yes={() => <SubSection
                  data-id="7bd8fbe36294"
                  key={subSection.label}
                  menuOpen={menuOpen}
                  setMenuOpen={setMenuOpen}
                  subsection={subSection} />} />)
            );
          }
          return (
            <SubSection
              data-id="7b197efb6b4c"
              key={subSection.label}
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              subsection={subSection} />
          );
        })}
      {isPathActive(url, { exact: true }) && !showFiltersPanel && isTrackerComponent && responsesStatusesCounts && (
        <>
          {Object.keys(responsesStatusesCounts).length !== 0 && (
            <NavigationLeftFilters
              data-id="16e219fc9e4f"
              filter={['all', responsesStatusesCounts.compliant + responsesStatusesCounts.nonCompliant]}
              menuOpen={menuOpen} />
          )}
          {Object.entries(responsesStatusesCounts).map((filter) => (
            <NavigationLeftFilters
              data-id="436a085a68e1"
              filter={filter}
              key={filter[0]}
              menuOpen={menuOpen} />
          ))}
        </>
      )}
    </Box>
  </>);
}

export default NavigationLeftItem;

export const navigationLeftItemStyles = {
  navigationLeftItem: {
    selectedMenuItem: '#1F1F1F',
    unselectedMenuItem: '#818197',
    selectedLabelBg: '#462AC4',
    unselectedLabelBg: '#ffffff',
    selectedIconStroke: '#ffffff',
    unselectedIconStroke: '#818197',
  },
};
