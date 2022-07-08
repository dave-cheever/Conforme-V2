import React from 'react';

import { Box, Flex, Icon, Text } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import useNavigate from '../../hooks/useNavigate';
import { ArrowRight } from '../../icons';
import { IMenuItem } from '../../interfaces/IMenu';
import NavigationLeftFilters from '../NavigationLeft/NavigationLeftFilters';
import SubSection from '../NavigationLeft/SubSection';

const NavigationBottomItem = ({
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
  const { navigateTo, isPathActive } = useNavigate();
  const { url, icon, label } = menuItem;
  const { responsesStatusesCounts } = useFiltersContext();

  return (
    <Flex
      alignItems="center"
      css={{
        ':not(:first-of-type)': {
          marginLeft: '25px',
        },
      }}
      flexGrow={menuItem.subSections ? (isPathActive(url) ? 1 : 0) : isPathActive(url, { exact: true }) ? 1 : 0}
      onClick={() => {
        if (menuItem.url === '/') {
          setFiltersOpen(!filtersOpen);
          setSubsectionOpen(false);
          navigateTo(url);
        } else if (menuItem.url === '/admin') {
          setSubsectionOpen(!subsectionOpen);
          setFiltersOpen(false);
        } else navigateTo(url);
      }}
      pos="relative"
    >
      <Flex
        alignItems="center"
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
        rounded="8px"
        w="30px"
      >
        <Icon
          as={icon}
          h="15px"
          stroke={
            menuItem.subSections
              ? isPathActive(url)
                ? 'navigationLeftItemTablet.selectedIconStroke'
                : 'navigationLeftItemTablet.unselectedIconStroke'
              : isPathActive(url, { exact: true })
                ? 'navigationLeftItemTablet.selectedIconStroke'
                : 'navigationLeftItemTablet.unselectedIconStroke'
          }
          w="15px"
        />
      </Flex>
      {((menuItem.subSections && isPathActive(url)) || (!menuItem.subSections && isPathActive(url, { exact: true }))) && (
        <>
          <Text color="#818197" fontSize="11px" ml="15px">
            {label}
          </Text>
          {menuItem.subSections && <ArrowRight boxSize="10px" ml="15px" stroke="#818197" transform="rotate(270deg)" />}
        </>
      )}
      {filtersOpen && menuItem.url === '/' && (
        <Box
          bg="white"
          bottom="45px"
          boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)"
          left="0"
          pos="absolute"
          py="15px"
          rounded="10px"
          w="220px"
          zIndex="5"
        >
          {Object.keys(responsesStatusesCounts).length !== 0 && (
            <NavigationLeftFilters
              filter={['all', responsesStatusesCounts.compliant + responsesStatusesCounts.nonCompliant]}
              setFiltersOpen={setFiltersOpen}
            />
          )}
          {Object.entries(responsesStatusesCounts).map((filter) => (
            <NavigationLeftFilters filter={filter} key={filter[0]} setFiltersOpen={setFiltersOpen} />
          ))}
        </Box>
      )}
      {subsectionOpen && menuItem.url === '/admin' && (
        <Box
          bg="white"
          bottom="45px"
          boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)"
          left={menuItem.subSections ? (isPathActive(url) ? '0' : '-200px') : isPathActive(url, { exact: true }) ? '0' : '-200px'}
          pos="absolute"
          py="15px"
          rounded="10px"
          w="235px"
          zIndex="5"
        >
          {menuItem.subSections?.map((subSection) => (
            <SubSection key={subSection.label} subsection={subSection} />
          ))}
        </Box>
      )}
    </Flex>
  );
};

export default NavigationBottomItem;
