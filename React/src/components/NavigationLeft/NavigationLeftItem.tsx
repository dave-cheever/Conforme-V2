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
        data-id="000559"
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
        <Flex data-id="000560" align="center" h="100%" >
          <Flex
            data-id="000561"
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
            h="30px"
            justifyContent="center"
            ml="25px"
            rounded="8px"
            w="30px">
            <Icon
              data-id="000562"
              as={icon}
              fill="#ffffff"
              h="21px"
              stroke="#ffffff"
              w="21px" />
          </Flex>
          {showFiltersPanel && (menuItem.subSections?.length > 0 || isPathActive(url, { exact: true })) && (
            <ArrowRight data-id="000563" boxSize="10px" ml={1} />
          )}
        </Flex>
        {!showFiltersPanel && (
          <Box
            data-id="000564"
            color={
              menuItem.subSections
                ? isPathActive(url)
                  ? 'navigationLeftItem.selectedMenuItem'
                  : 'navigationLeftItem.unselectedMenuItem'
                : isPathActive(url, { exact: true })
                  ? 'navigationLeftItem.selectedMenuItem'
                  : 'navigationLeftItem.unselectedMenuItem'
            }
            fontWeight="400"
            ml="5">
            {!showFiltersPanel && capitalize(label) }
          </Box>
        )}
      </Box>
      <Box data-id="000565">
        {isPathActive(url) &&
          !showFiltersPanel &&
          menuItem.subSections?.map((subSection) => {
            if (subSection.permission) {
              return (
                <Can
                    data-id="000566"
                    action={subSection.permission}
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
        {isPathActive(url, { exact: true }) && !showFiltersPanel && isTrackerComponent && responsesStatusesCounts && (
          <>
            {Object.keys(responsesStatusesCounts).length !== 0 && (
              <NavigationLeftFilters
                data-id="000569"
                filter={['all', responsesStatusesCounts.compliant + responsesStatusesCounts.nonCompliant]}
                menuOpen={menuOpen} />
            )}
            {Object.entries(responsesStatusesCounts).map((filter) => (
              <NavigationLeftFilters
                data-id="000570"
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
