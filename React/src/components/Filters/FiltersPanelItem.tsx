import { useMemo } from 'react';

import { Box, Flex, Text, useDisclosure } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import { ArrowDownIcon, ArrowUpIcon, ResetIcon } from '../../icons';
import IFilter from '../../interfaces/IFilter';
import BusinessUnitFilter from './BusinessUnitFilter';
import CategoryFilter from './CategoryFilter';
import DateFilter from './DateFilter';
import LocationFilter from './LocationFilter';
import RegulatoryBodyFilter from './RegulatoryBodyFilter';
import StateChoiceFilter from './StateChoiceFilter';
import TrackerItemFilter from './TrackerItemFilter';
import UserFilter from './UserFilter';

const FiltersPanelItem = ({ name, filter }: { name: string; filter: IFilter }) => {
  const { isOpen, onToggle } = useDisclosure();
  const { setFilters, filtersValues } = useFiltersContext();

  const filtersLength = useMemo(
    () => (Array.isArray(filtersValues?.[name]?.value) ? filtersValues?.[name]?.value?.length : 0),
    [filtersValues, name],
  );

  const renderPanel = () => {
    switch (name) {
      case 'businessUnitsIds':
        return <BusinessUnitFilter />;

      case 'categoriesIds':
        return <CategoryFilter />;

      case 'trackerItemsIds':
        return <TrackerItemFilter />;

      case 'dueDate':
        return <DateFilter filterName="dueDate" />;
      case 'createdDate':
        return <DateFilter filterName="createdDate" />;

      case 'locationsIds':
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

  return (
    <Flex
      bg={isOpen ? 'filtersPanelItem.openBg' : 'filtersPanelItem.closeBg'}
      borderRadius="10px"
      flexDir="column"
      justify="center"
      key={name}
      my={2}
      p="3"
      w="full"
    >
      <Flex align="center" cursor="pointer" justify="space-between" mb={isOpen ? '4' : '0'} w="full">
        <Text color="filtersPanelItem.fontColor" fontSize="14px" onClick={onToggle} w="full">
          {filter?.name}
        </Text>
        <Flex>
          {filtersLength > 0 && (
            <Box
              bg="filtersPanelItem.countBg"
              borderRadius="10px"
              color="filtersPanelItem.countColor"
              fontSize="12px"
              fontWeight="400"
              mr="3"
              px="10px"
            >
              {filtersLength}
            </Box>
          )}
          {isOpen && filtersLength > 0 && <ResetIcon mr={3} onClick={resetFilter} />}
          {isOpen ? <ArrowUpIcon onClick={onToggle} /> : <ArrowDownIcon onClick={onToggle} />}
        </Flex>
      </Flex>
      {isOpen && renderPanel()}
    </Flex>
  );
};

export default FiltersPanelItem;

export const filtersPanelItemStyles = {
  filtersPanelItem: {
    openBg: '#F0F2F5',
    closeBg: '#F0F2F595',
    fontColor: '#282F36',
    countColor: '#818197',
    countBg: 'white',
  },
};
