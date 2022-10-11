import { useMemo, useRef } from 'react';

import { Box, Flex, Text, useDisclosure, useOutsideClick } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import { ArrowDownIcon, ArrowUpIcon, ResetIcon } from '../../icons';
import IFilter from '../../interfaces/IFilter';
import BusinessUnitFilter from './BusinessUnitFilter';
import CategoryFilter from './CategoryFilter';
import LocationFilter from './LocationFilter';
import QuickDateFilter from './QuickDateFilter';
import RegulatoryBodyFilter from './RegulatoryBodyFilter';
import StateChoiceFilter from './StateChoiceFilter';
import TrackerItemFilter from './TrackerItemFilter';
import UserFilter from './UserFilter';

const QuickFiltersItem = ({ name, filter, toggleActiveFilters }: { name: string; filter: IFilter; toggleActiveFilters?: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { setFilters, filtersValues } = useFiltersContext();
  useOutsideClick({
    ref,
    handler: onClose,
  });

  const filtersLength = useMemo(
    () => (Array.isArray(filtersValues?.[name]?.value) ? filtersValues?.[name]?.value?.length : 0),
    [filtersValues, name],
  );

  const renderPanel = () => {
    switch (name) {
      case 'businessUnitsIds':
      case 'areasIds':
        return <BusinessUnitFilter />;

      case 'categoriesIds':
        return <CategoryFilter />;

      case 'trackerItemsIds':
        return <TrackerItemFilter />;

      case 'locationsIds':
      case 'sitesIds':
        return <LocationFilter />;

      case 'regulatoryBodiesIds':
        return <RegulatoryBodyFilter />;

      case 'usersIds':
        return <UserFilter />;

      default:
        return <StateChoiceFilter name={name} />;
    }
  };

  const resetFilter = () => {
    const updatedFiltersValue = { ...filtersValues };
    updatedFiltersValue[name].value = [];
    setFilters({ filters: updatedFiltersValue });
  };

  return name.toLocaleLowerCase().includes('date') ? (
    <QuickDateFilter filterName={name} toggleActiveFilters={toggleActiveFilters} />
  ) : (
    <Flex direction="column" key={`quick-filter-item-${name}`}>
      <Flex
        align="center"
        bg={isOpen ? 'quickFiltersItem.openBg' : 'quickFiltersItem.closeBg'}
        borderBottomRadius={isOpen ? '0px' : '10px'}
        borderTopRadius="10px"
        cursor="pointer"
        direction="row"
        justify="center"
        mr={4}
        onClick={() => {
          onToggle();
          if (toggleActiveFilters) toggleActiveFilters();
        }}
        p={3}
        w="215px"
      >
        <Text color="#1E1836" fontSize="14px" fontWeight="500" lineHeight="20px" w="full">
          {filter?.name}
        </Text>
        <Flex>
          {filtersLength > 0 && (
            <Box
              bg="quickFiltersItem.countBg"
              borderRadius="10px"
              color="quickFiltersItem.countColor"
              fontSize="12px"
              fontWeight="400"
              mr="3"
              px="10px"
            >
              {filtersLength}
            </Box>
          )}
          {filtersLength > 0 && <ResetIcon mr={3} onClick={resetFilter} />}
          {isOpen ? <ArrowUpIcon onClick={onToggle} /> : <ArrowDownIcon onClick={onToggle} />}
        </Flex>
      </Flex>
      {isOpen && (
        <Flex
          align="center"
          bg="quickFiltersItem.openBg"
          borderBottomRadius="10px"
          p={3}
          position="absolute"
          ref={ref}
          top="44px"
          w="215px"
        >
          {isOpen && renderPanel()}
        </Flex>
      )}
    </Flex>
  );
};

export default QuickFiltersItem;

export const quickFiltersItemStyles = {
  quickFiltersItem: {
    openBg: '#F0F2F5',
    closeBg: '#F0F2F595',
    fontColor: '#282F36',
    countColor: '#818197',
    countBg: 'white',
  },
};
