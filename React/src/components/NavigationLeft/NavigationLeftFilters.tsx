import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { Box, Flex } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import useResponseUtils from '../../hooks/useResponseUtils';

function NavigationLeftFilters({
  filter,
  setFiltersOpen,
}: {
  filter: any;
  menuOpen?: boolean;
  setFiltersOpen?: (value: boolean) => void;
}) {
  const { pathname } = useLocation();
  const { filtersValues, setFilters } = useFiltersContext();
  const { responseStatuses } = useResponseUtils();
  const itemStatusFilterValue = useMemo(
    () => filtersValues.itemStatus?.value,
    [filtersValues],
  ) as string[];

  const lastPathSegment = pathname.split('/').filter(Boolean).pop();
  if (lastPathSegment === 'help') return null;

  const updateFilters = (name: any) => {
    let newValue: any = [];
    const value = filtersValues.itemStatus?.value || [];
    if (name === 'all') newValue = [];
    else if (!value.includes(name)) newValue = [...value, name];
    else newValue = value.filter((item) => item !== name);

    setFilters({ itemStatus: newValue });
  };

  return (
    <Flex
    borderRadius="6px"
    data-id="3143fecc7acc"
    direction="column"
    key={filter[0]}
  >
    {filter[0] === 'comingUp' && (
      <Flex data-id="883873cdc842" py={2}>
        <Flex
          bg="navigationLeftFilters.seperator"
          data-id="fa271f7b04b8"
          h="1px"
          ml="25px"
          opacity="0.3"
          rounded="lg"
          w="30px"
        />
      </Flex>
    )}

    <Flex
      align="center"
      bg={
        (filter[0] === 'all' && itemStatusFilterValue?.length === 0) ||
        itemStatusFilterValue?.includes(filter[0])
          ? 'subSectionBG.selectedFontColor'
          : 'subSectionBG.unselectedFontColor'
      }
      borderRadius="6px"
      color={
        filter[0] === 'all'
          ? itemStatusFilterValue?.length === 0
            ? 'navigationLeftFilters.selectedFontColor'
            : 'navigationLeftFilters.unselectedFontColor'
          : itemStatusFilterValue?.includes(filter[0])
          ? 'navigationLeftFilters.selectedFontColor'
          : 'navigationLeftFilters.unselectedFontColor'
      }
      cursor="pointer"
      data-id="d4f80633f5fe"
      fontSize="14px"
      fontWeight="400"
      justify="space-between"
      lineHeight="40px"
      ml="36px"
      onClick={() => {
        updateFilters(filter[0]);
        if (setFiltersOpen) setFiltersOpen(false);
      }}
      pl="35px"
      position="relative"
      pr="21px"
      right={[0, '37px']}
      w="100%"
    >
      <Flex align="center" data-id="2315dc824dec">
        <Box
          bg={`navigationLeftFilters.${filter[0]}`}
          data-id="1fd0c0f8c46b"
          h="8px"
          mr={8}
          rounded="full"
          w="8px"
        />
        {responseStatuses[filter[0]]}
      </Flex>
      <Flex
        align="center"
        bg={
          (filter[0] === 'all' && itemStatusFilterValue?.length === 0) ||
          itemStatusFilterValue?.includes(filter[0])
            ? '#ffffff'
            : 'transparent'
        }
        border={
          (filter[0] === 'all' && itemStatusFilterValue?.length === 0) ||
          itemStatusFilterValue?.includes(filter[0])
            ? 'none'
            : '1px solid #CBD5E0'
        }
        color={
          (filter[0] === 'all' && itemStatusFilterValue?.length === 0) ||
          itemStatusFilterValue?.includes(filter[0])
            ? '#110B30'
            : '#CBD5E0'
        }
        fontSize="11px"
        fontWeight="600"
        h="20px"
        justify="center"
        left="10px"
        position="relative"
        rounded="10px"
        w="34px"
      >
        {filter[1]}
      </Flex>
    </Flex>
   </Flex>

  );
}

export default NavigationLeftFilters;

export const navigationLeftFiltersStyles = {
  navigationLeftFilters: {
    all: '#818197',
    compliant: '#41B916',
    nonCompliant: '#E93C44',
    comingUp: '#FF9A00',
    selectedLabelBg: '#282F36',
    unselectedLabelBg: '#ffffff',
    selectedLabelFontColor: '#ffffff',
    unselectedLabelFontColor: '#818197',
    selectedFontColor: '#ffffff',
    unselectedFontColor: '#ffffff',
    seperator: '#818197',
    selectedMenuItem: "#462AC4",
  },
};
