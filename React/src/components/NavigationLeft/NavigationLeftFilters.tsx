import { useMemo } from 'react';

import { Box, Flex } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import useResponseUtils from '../../hooks/useResponseUtils';

const NavigationLeftFilters = ({
  filter,
  setFiltersOpen,
}: {
  filter: any;
  menuOpen?: boolean;
  setFiltersOpen?: (value: boolean) => void;
}) => {
  const { responseStatuses } = useResponseUtils();
  const { filtersValues, setFilters } = useFiltersContext();
  const itemStatusFilterValue = useMemo(() => filtersValues.itemStatus?.value, [filtersValues]) as string[];

  const updateFilters = (name: any) => {
    let newValue: any = [];
    const value = filtersValues.itemStatus?.value || [];
    if (name === 'all') newValue = [];
    else if (!value.includes(name)) newValue = [...value, name];
    else newValue = value.filter((item) => item !== name);

    setFilters({ itemStatus: newValue });
  };

  return (
    <Flex direction="column" key={filter[0]}>
      {filter[0] === 'comingUp' && (
        <Flex py={2}>
          <Flex bg="navigationLeftFilters.seperator" h="1px" ml="25px" opacity="0.3" rounded="lg" w="30px" />
        </Flex>
      )}
      <Flex
        align="center"
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
        fontSize="14px"
        fontWeight="400"
        justify="space-between"
        key={filter[0]}
        lineHeight="40px"
        ml={['25px', '60px', '70px']}
        onClick={() => {
          updateFilters(filter[0]);
          if (setFiltersOpen) setFiltersOpen(false);
        }}
        position="relative"
        right={[0, '37px']}
        w={['170px', '175px']}
      >
        <Flex align="center">
          <Box bg={`navigationLeftFilters.${filter[0]}`} h="8px" mr={8} rounded="full" w="8px" />
          {responseStatuses[filter[0]]}
        </Flex>
        <Flex
          align="center"
          bg={
            filter[0] === 'all' && itemStatusFilterValue?.length === 0
              ? 'navigationLeftFilters.selectedLabelBg'
              : itemStatusFilterValue?.includes(filter[0])
              ? 'navigationLeftFilters.selectedLabelBg'
              : 'navigationLeftFilters.unselectedLabelBg'
          }
          color={
            filter[0] === 'all' && itemStatusFilterValue?.length === 0
              ? 'navigationLeftFilters.selectedLabelFontColor'
              : itemStatusFilterValue?.includes(filter[0])
              ? 'navigationLeftFilters.selectedLabelFontColor'
              : 'navigationLeftFilters.unselectedLabelFontColor'
          }
          fontSize="11px"
          fontWeight="700"
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
};

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
    selectedFontColor: '#282F36',
    unselectedFontColor: '#818197',
    seperator: '#818197',
  },
};
