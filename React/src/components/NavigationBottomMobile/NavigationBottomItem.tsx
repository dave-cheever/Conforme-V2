import React from 'react';

import { Box, Flex, Icon, Text } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import useNavigate from '../../hooks/useNavigate';
import { ArrowRight } from '../../icons';
import { IMenuItem } from '../../interfaces/IMenu';
import NavigationLeftFilters from '../NavigationLeft/NavigationLeftFilters';
import SubSection from '../NavigationLeft/SubSection';

function NavigationBottomItem({
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
  const { navigateTo, isPathActive } = useNavigate();
  const { url, icon, label } = menuItem;
  const { responsesStatusesCounts } = useFiltersContext();

  return (
    <Flex
        alignItems="center"
        data-id="000527"
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
        pos="relative">
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
        data-id="000528"
        h="30px"
        justifyContent="center"
        rounded="8px"
        w="30px">
        <Icon
          as={icon}
          data-id="000529"
          fill="#ffffff"
          h="15px"
          stroke="#ffffff"
          w="15px" />
      </Flex>
      {((menuItem.subSections && isPathActive(url)) || (!menuItem.subSections && isPathActive(url, { exact: true }))) && (
        <>
          <Text color="#ffffff" data-id="000530" fontSize="16px" ml="15px">
            {label}
          </Text>
          {menuItem.subSections && <ArrowRight
            boxSize="10px"
            data-id="000531"
            ml="15px"
            stroke="#fffff"
            transform="rotate(270deg)" />}
        </>
      )}
      {filtersOpen && menuItem.url === '/' && (
        <Box
          bg="white"
          bottom="45px"
          boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)"
          data-id="000532"
          pos="absolute"
          py="15px"
          right="0"
          rounded="10px"
          w="220px"
          zIndex="5">
          {Object.keys(responsesStatusesCounts).length !== 0 && (
            <NavigationLeftFilters
              data-id="000533"
              filter={['all', responsesStatusesCounts.compliant + responsesStatusesCounts.nonCompliant]}
              setFiltersOpen={setFiltersOpen} />
          )}
          {Object.entries(responsesStatusesCounts).map((filter) => (
            <NavigationLeftFilters
              data-id="000534"
              filter={filter}
              key={filter[0]}
              setFiltersOpen={setFiltersOpen} />
          ))}
        </Box>
      )}
      {subsectionOpen && menuItem.url === '/admin' && (
        <Box
          bg="white"
          bottom="45px"
          boxShadow="0px 0px 80px rgba(49, 50, 51, 0.25)"
          data-id="000535"
          left={menuItem.subSections ? (isPathActive(url) ? '' : '-200px') : isPathActive(url, { exact: true }) ? '' : '-200px'}
          pos="absolute"
          py="15px"
          right={menuItem.subSections ? (isPathActive(url) ? '0' : '') : isPathActive(url, { exact: true }) ? '0' : ''}
          rounded="10px"
          w="235px"
          zIndex="5">
          {menuItem.subSections?.map((subSection) => (
            <SubSection data-id="000536" isPopover key={subSection.label} subsection={subSection} />
          ))}
        </Box>
      )}
    </Flex>
  );
}

export default NavigationBottomItem;
