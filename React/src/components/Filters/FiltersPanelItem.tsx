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
        return <BusinessUnitFilter data-id="72f129a8bbaa" />;

      case 'categoriesIds':
        return <CategoryFilter data-id="ad6899b9ad01" />;

      case 'trackerItemsIds':
        return <TrackerItemFilter data-id="3ed6f304f2a0" />;

      case 'dueDate':
        return <DateFilter data-id="87a84344d5b2" filterName="dueDate" />;
      case 'createdDate':
        return <DateFilter data-id="0efbd52b4227" filterName="createdDate" />;

      case 'locationsIds':
        return <LocationFilter data-id="12967ca91228" />;

      case 'regulatoryBodiesIds':
        return <RegulatoryBodyFilter data-id="d2c13119dad1" />;

      case 'usersIds':
        return <UserFilter data-id="bfdb546cbb74" />;

      default:
        return <StateChoiceFilter data-id="37719d801df8" name={name} />;
    }
  };

  const resetFilter = () => {
    const updatedFiltersValue = { ...filtersValues };
    updatedFiltersValue[name].value = [];

    setFilters({ filters: updatedFiltersValue });
  };

  return (<>
    {name === 'showArchived' ? (
      <ShowArchivedFilter data-id="e70badd418f8" />
    ) : (
      <Flex
        bg={isOpen ? 'filtersPanelItem.openBg' : 'filtersPanelItem.closeBg'}
        borderRadius="10px"
        data-id="4102aa8a02db"
        flexDir="column"
        justify="center"
        key={name}
        my={2}
        p="3"
        w="full">
        <Flex
          align="center"
          cursor="pointer"
          data-id="ee2f0c7a37f7"
          justify="space-between"
          mb={isOpen ? '4' : '0'}
          w="full">
          <Text
            color="filtersPanelItem.fontColor"
            data-id="b574cebb7444"
            fontSize="14px"
            onClick={onToggle}
            w="full">
            {filter?.name}
          </Text>
          <Flex data-id="f849a50c3e1f">
            {filtersLength > 0 && (
              <Box
                bg="filtersPanelItem.countBg"
                borderRadius="10px"
                color="filtersPanelItem.countColor"
                data-id="59da7020fe86"
                fontSize="12px"
                fontWeight="400"
                mr="3"
                px="10px">
                {filtersLength}
              </Box>
            )}
            {isOpen && filtersLength > 0 && <ResetIcon data-id="e4f38d6f9e78" mr={3} onClick={resetFilter} />}
            {isOpen ? <ArrowUpIcon data-id="e7139b4ec4a7" onClick={onToggle} /> : <ArrowDownIcon data-id="8276a86130d3" onClick={onToggle} />}
          </Flex>
        </Flex>
        {isOpen && renderPanel()}
      </Flex>
    )}
  </>);
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
