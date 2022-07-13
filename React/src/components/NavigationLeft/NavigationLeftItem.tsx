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

const NavigationLeftItem = ({ menuItem }: { menuItem: IMenuItem }) => {
  const { organizationConfig } = useAppContext();
  const isTrackerComponent = organizationConfig?.modules.find(({ type }) => type === 'tracker');
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
        w="240px"
      >
        <Flex align="center" h="100%">
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
            h="30px"
            justifyContent="center"
            ml="25px"
            rounded="8px"
            w="30px"
          >
            <Icon
              as={icon}
              h="15px"
              stroke={
                menuItem.subSections
                  ? isPathActive(url)
                    ? 'navigationLeftItem.selectedIconStroke'
                    : 'navigationLeftItem.unselectedIconStroke'
                  : isPathActive(url, { exact: true })
                  ? 'navigationLeftItem.selectedIconStroke'
                  : 'navigationLeftItem.unselectedIconStroke'
              }
              w="15px"
            />
          </Flex>
          {showFiltersPanel && (menuItem.subSections?.length > 0 || isPathActive(url, { exact: true })) && (
            <ArrowRight boxSize="10px" ml={1} />
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
            fontWeight="400"
            ml="5"
          >
            {!showFiltersPanel && capitalize(label)}
          </Box>
        )}
      </Box>
      <Box>
        {isPathActive(url) &&
          !showFiltersPanel &&
          menuItem.subSections?.map((subSection) => {
            if (subSection.permission) {
              return (
                <Can
                  action={subSection.permission}
                  key={subSection.url}
                  yes={() => <SubSection key={subSection.label} menuOpen={menuOpen} setMenuOpen={setMenuOpen} subsection={subSection} />}
                />
              );
            }
            return <SubSection key={subSection.label} menuOpen={menuOpen} setMenuOpen={setMenuOpen} subsection={subSection} />;
          })}
        {isPathActive(url, { exact: true }) && !showFiltersPanel && isTrackerComponent && (
          <>
            {Object.keys(responsesStatusesCounts).length !== 0 && (
              <NavigationLeftFilters
                filter={['all', responsesStatusesCounts.compliant + responsesStatusesCounts.nonCompliant]}
                menuOpen={menuOpen}
              />
            )}
            {Object.entries(responsesStatusesCounts).map((filter) => (
              <NavigationLeftFilters filter={filter} key={filter[0]} menuOpen={menuOpen} />
            ))}
          </>
        )}
      </Box>
    </>
  );
};

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
