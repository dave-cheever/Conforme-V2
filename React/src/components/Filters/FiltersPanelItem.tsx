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
import ShowArchivedFilter from './ShowArchivedFilter';
import StateChoiceFilter from './StateChoiceFilter';
import TrackerItemFilter from './TrackerItemFilter';
import TrackerItemStatusFilter from './TrackerItemStatusFilter';
import UserFilter from './UserFilter';

function FiltersPanelItem({ name, filter }: { name: string; filter: IFilter }) {
  const { isOpen, onToggle } = useDisclosure();
  const { setFilters, filtersValues } = useFiltersContext();

  const filtersLength: number = useMemo(
    () => {
      const filterValue = filtersValues?.[name]?.value;
      if (Array.isArray(filterValue))
        return filterValue?.length;

      if (typeof filterValue === 'object' && !Array.isArray(filterValue) && filterValue !== null)
        return Object.values(filterValue).reduce((acc: number, curr) => acc + (curr as string[]).length, 0);

      return 0;
    },
    [filtersValues, name],
  );

  const renderPanel = () => {
    switch (name) {
      case 'businessUnitsIds':
        return <BusinessUnitFilter data-id="030925-9a47c7" />;

      case 'categoriesIds':
        return <CategoryFilter data-id="030925-fb8e63" />;

      case 'trackerItemsIds':
        return <TrackerItemFilter data-id="030925-1f8881" />;

      case 'dueDate':
        return <DateFilter data-id="030925-8430fc" filterName="dueDate" />;
      case 'createdDate':
        return <DateFilter data-id="030925-5e6f1a" filterName="createdDate" />;

      case 'locationsIds':
        return <LocationFilter data-id="030925-f8aa6e" />;

      case 'regulatoryBodiesIds':
        return <RegulatoryBodyFilter data-id="030925-8f12ea" />;

      case 'usersIds':
        return <UserFilter data-id="030925-d6f59c" />;

      case 'Status':
        return <TrackerItemStatusFilter data-id="030925-24e0ff" name={name} />;

      default:
        return <StateChoiceFilter data-id="030925-97a933" name={name} />;
    }
  };

  const resetFilter = () => {
    const updatedFiltersValue = { ...filtersValues };
    updatedFiltersValue[name].value = [];

    setFilters({ filters: updatedFiltersValue });
  };

  return (name === 'showArchived' ? (<ShowArchivedFilter data-id="030925-7cac50" />) : (<Flex
    data-id="030925-0681ed"
    bg={isOpen ? 'filtersPanelItem.openBg' : 'filtersPanelItem.closeBg'}
    borderRadius="10px"
    flexDir="column"
    justify="center"
    key={name}
    my={2}
    p="3"
    w="full">
    <Flex
      data-id="030925-785d0a"
      align="center"
      cursor="pointer"
      justify="space-between"
      mb={isOpen ? '4' : '0'}
      w="full">
      <Text
        data-id="030925-5dac3d"
        color="filtersPanelItem.fontColor"
        fontSize="14px"
        onClick={onToggle}
        w="full">
        {filter?.name}
      </Text>
      <Flex data-id="030925-36ae14">
        {filtersLength > 0 && (
          <Box
            data-id="030925-2267c6"
            bg="filtersPanelItem.countBg"
            borderRadius="10px"
            color="filtersPanelItem.countColor"
            fontSize="12px"
            fontWeight="400"
            mr="3"
            px="10px">
            {filtersLength}
          </Box>
        )}
        {isOpen && filtersLength > 0 && <ResetIcon data-id="030925-3b8d4e" mr={3} onClick={resetFilter} />}
        {isOpen ? <ArrowUpIcon data-id="030925-b7ebab" onClick={onToggle} /> : <ArrowDownIcon data-id="030925-893e7c" onClick={onToggle} />}
      </Flex>
    </Flex>
    {isOpen && renderPanel()}
  </Flex>));
}

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
