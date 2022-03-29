import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Box, Flex, Icon } from '@chakra-ui/react';

import { useAppContext } from '../../contexts/AppProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import { ArrowRight } from '../../icons';
import { IMenuItem } from '../../interfaces/IMenu';
import NavigationLeftFilters from './NavigationLeftFilters';
import SubSection from './SubSection';

const NavigationLeftItem = ({ menuItem }: { menuItem: IMenuItem }) => {
  const { organizationConfig } = useAppContext();
  const isTrackerComponent = organizationConfig?.addons.find(
    ({ name }) => name === 'tracker',
  );
  const history = useHistory();
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
          if (menuItem.subSections) history.push(menuItem.subSections[0].url);
          else history.push(url);
        }}
        pos="relative"
        w="240px"
      >
        <Flex align="center" h="100%">
          <Flex
            alignItems="center"
            bg={
              menuItem.subSections
                ? history.location.pathname.includes(url)
                  ? 'navigationLeftItem.selectedLabelBg'
                  : 'navigationLeftItem.unselectedLabelBg'
                : history.location.pathname === url
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
                  ? history.location.pathname.includes(url)
                    ? 'navigationLeftItem.selectedIconStroke'
                    : 'navigationLeftItem.unselectedIconStroke'
                  : history.location.pathname === url
                  ? 'navigationLeftItem.selectedIconStroke'
                  : 'navigationLeftItem.unselectedIconStroke'
              }
              w="15px"
            />
          </Flex>
          {showFiltersPanel &&
            (menuItem.subSections?.length > 0 ||
              (history.location.pathname === '/' &&
                history.location.pathname === url)) && (
              <ArrowRight boxSize="10px" ml={1} />
            )}
        </Flex>
        {!showFiltersPanel && (
          <Box
            color={
              menuItem.subSections
                ? history.location.pathname.includes(url)
                  ? 'navigationLeftItem.selectedMenuItem'
                  : 'navigationLeftItem.unselectedMenuItem'
                : history.location.pathname === url
                ? 'navigationLeftItem.selectedMenuItem'
                : 'navigationLeftItem.unselectedMenuItem'
            }
            fontWeight="400"
            ml="5"
          >
            {!showFiltersPanel && label}
          </Box>
        )}
      </Box>
      <Box>
        {history.location.pathname.includes(url) &&
          !showFiltersPanel &&
          menuItem.subSections?.map((subSection) => (
            <SubSection
              key={subSection.label}
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              subsection={subSection}
            />
          ))}
        {history.location.pathname === '/' &&
          history.location.pathname === url &&
          !showFiltersPanel &&
          isTrackerComponent && (
            <>
              {Object.keys(responsesStatusesCounts).length !== 0 && (
                <NavigationLeftFilters
                  filter={[
                    'all',
                    responsesStatusesCounts.compliant +
                      responsesStatusesCounts.nonCompliant,
                  ]}
                  menuOpen={menuOpen}
                />
              )}
              {Object.entries(responsesStatusesCounts).map((filter) => (
                <NavigationLeftFilters
                  filter={filter}
                  key={filter[0]}
                  menuOpen={menuOpen}
                />
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
