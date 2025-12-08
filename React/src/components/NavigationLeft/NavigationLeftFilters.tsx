import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { Box, Flex } from '@chakra-ui/react';

import { useAppContext } from '../../contexts/AppProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import useResponseUtils from '../../hooks/useResponseUtils';
import updateLocalStorageFilter from '../../utils/filterStorage';

function NavigationLeftFilters({
  filter,
  setFiltersOpen,
}: {
  filter: any;
  menuOpen?: boolean;
  setFiltersOpen?: (value: boolean) => void;
}) {
  const { pathname } = useLocation();
  const { user, module } = useAppContext();
  const { filtersValues, applyFiltersImmediately } = useFiltersContext();
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

    // Save to localStorage and apply filters immediately to trigger network call
    if (user && module) {
      updateLocalStorageFilter(module._id, 'itemStatus', 'Item Status', newValue, user.userId, applyFiltersImmediately);
    } else {
      applyFiltersImmediately({ itemStatus: newValue });
    }
  };

  return (
    <Flex
    borderRadius="6px"
    data-id="000537"
    direction="column"
    key={filter[0]}
  >
      {filter[0] === 'comingUp' && (
        <Flex data-id="000538" py={2}>
          <Flex
            bg="navigationLeftFilters.seperator"
            data-id="000539"
            h="1px"
            ml="25px"
            opacity="0.3"
            rounded="lg"
            w="30px"
          />
        </Flex>
      )}
      <Flex
        _hover={{
          cursor: 'pointer',
          bg: (() => {
            const isSelected = (filter[0] === 'all' && itemStatusFilterValue?.length === 0) ||
              itemStatusFilterValue?.includes(filter[0]);
            return isSelected ? undefined : 'navigationLeftFilters.hoverLabelBg';
          })(),
        }}
        align="center"
        bg={
          (filter[0] === 'all' && itemStatusFilterValue?.length === 0) ||
          itemStatusFilterValue?.includes(filter[0])
            ? '#0067a34d'
            : 'navigationLeftFilters.unselectedSubMenuItemBg'
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
        data-id="000540"
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
        sx={{
          '&:hover': (() => {
            const isSelected = (filter[0] === 'all' && itemStatusFilterValue?.length === 0) ||
              itemStatusFilterValue?.includes(filter[0]);
            return isSelected ? {} : { backgroundColor: 'navigationLeftFilters.hoverLabelBg' };
          })(),
        }}
        transition="all 0.2s ease-out"
        w="100%"
      >
        <Flex align="center" data-id="000541">
          <Box
            bg={`navigationLeftFilters.${filter[0]}`}
            data-id="000542"
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
          data-id="000543"
          fontSize="11px"
          fontWeight="600"
          h="20px"
          justify="center"
          left="10px"
          position="relative"
          rounded="10px"
          w="34px">
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
    unselectedSubMenuItemBg: '#01173E',
    selectedMenuItemBg: '#0068A3',
    hoverLabelBg: '#2A3B6C',
    seperator: '#818197',
    selectedMenuItem: "#462AC4",
  },
};
