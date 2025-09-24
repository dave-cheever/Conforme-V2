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
        return <BusinessUnitFilter data-id="000087" />;

      case 'categoriesIds':
        return <CategoryFilter data-id="000088" />;

      case 'trackerItemsIds':
        return <TrackerItemFilter data-id="000089" />;

      case 'dueDate':
        return <DateFilter data-id="000090" filterName="dueDate" />;
      case 'createdDate':
        return <DateFilter data-id="000091" filterName="createdDate" />;

      case 'locationsIds':
        return <LocationFilter data-id="000092" />;

      case 'regulatoryBodiesIds':
        return <RegulatoryBodyFilter data-id="000093" />;

      case 'usersIds':
        return <UserFilter data-id="000094" />;

      case 'Status':
        return <TrackerItemStatusFilter data-id="000095" name={name} />;

      default:
        return <StateChoiceFilter data-id="000096" name={name} />;
    }
  };

  const resetFilter = () => {
    const updatedFiltersValue = { ...filtersValues };
    updatedFiltersValue[name].value = [];

    setFilters({ filters: updatedFiltersValue });
  };

  return (name === 'showArchived' ? (<ShowArchivedFilter data-id="000097" />) : (<Flex
    data-id="000098"
    bg={isOpen ? 'filtersPanelItem.openBg' : 'filtersPanelItem.closeBg'}
    borderRadius="10px"
    flexDir="column"
    justify="center"
    key={name}
    my={2}
    p="3"
    w="full">
    <Flex
      data-id="000099"
      align="center"
      cursor="pointer"
      justify="space-between"
      mb={isOpen ? '4' : '0'}
      w="full">
      <Text
        data-id="000100"
        color="filtersPanelItem.fontColor"
        fontSize="14px"
        onClick={onToggle}
        w="full">
        {filter?.name}
      </Text>
      <Flex data-id="000101">
        {filtersLength > 0 && (
          <Box
            data-id="000102"
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
        {isOpen && filtersLength > 0 && <ResetIcon data-id="000103" mr={3} onClick={resetFilter} />}
        {isOpen ? <ArrowUpIcon data-id="000104" onClick={onToggle} /> : <ArrowDownIcon data-id="000105" onClick={onToggle} />}
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
