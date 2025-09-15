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
  const { module } = useAppContext();
  const isTrackerComponent = module?.type === "tracker";
  const { navigateTo, isPathActive } = useNavigate();
  const { url, icon, label } = menuItem;
  const [menuOpen, setMenuOpen] = useState(true);
  const { showFiltersPanel, responsesStatusesCounts } = useFiltersContext();

  return (
    <>
      <Box
        _hover={{
          cursor: 'pointer',
        }}
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
        borderRadius={"6px"}
        data-id="030925-6146a1"
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
        w="250px"
        >
        <Flex align="center" data-id="030925-7658e1" h="100%" >
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
            data-id="030925-ca30a4"
            h="30px"
            justifyContent="center"
            ml="25px"
            rounded="8px"
            w="30px">
            <Icon
              as={icon}
              data-id="030925-3d40c6"
              fill="#ffffff"
              h="21px"
              stroke="#ffffff"
              w="21px" />
          </Flex>
          {showFiltersPanel && (menuItem.subSections?.length > 0 || isPathActive(url, { exact: true })) && (
            <ArrowRight boxSize="10px" data-id="030925-ec02fd" ml={1} />
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
            data-id="030925-d5ada2"
            fontWeight="400"
            ml="5">
            {!showFiltersPanel && capitalize(label) }
          </Box>
        )}
      </Box>
      <Box data-id="030925-9aaf4e">
        {isPathActive(url) &&
          !showFiltersPanel &&
          menuItem.subSections?.map((subSection) => {
            if (subSection.permission) {
              return (
                <Can
                    action={subSection.permission}
                    data-id="030925-35094a"
                    key={subSection.url}
                    // eslint-disable-next-line react/no-unstable-nested-components
                    yes={() => <SubSection
                      data-id="030925-2ca683"
                      key={subSection.label}
                      menuOpen={menuOpen}
                      setMenuOpen={setMenuOpen}
                      subsection={subSection} />} />
              );
            }
            return (
              <SubSection
                data-id="030925-7cb5a3"
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
                data-id="030925-fd811a"
                filter={['all', responsesStatusesCounts.compliant + responsesStatusesCounts.nonCompliant]}
                menuOpen={menuOpen} />
            )}
            {Object.entries(responsesStatusesCounts).map((filter) => (
              <NavigationLeftFilters
                data-id="030925-e6b0e3"
                filter={filter}
                key={filter[0]}
                menuOpen={menuOpen} />
            ))}
          </>
        )}
      </Box>
    </>
  );
}

export default NavigationLeftItem;

export const navigationLeftItemStyles = {
  navigationLeftItem: {
    selectedMenuItem: '#ffffff',
    unselectedMenuItem: '#ffffff',
    selectedLabelBg: '#1B0D5B',
    unselectedLabelBg: '##110B30',
    selectedIconStroke: '#ffffff',
    unselectedIconStroke: '#818197',
  },
};
