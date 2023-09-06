import { useEffect, useMemo, useRef, useState } from 'react';

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

function QuickFiltersItem({ name, filter, toggleActiveFilters }: { name: string; filter: IFilter; toggleActiveFilters?: () => void }) {
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

  const [pos, setPos] = useState('0px');
  useEffect(() => {
    setPos(`${(ref?.current?.parentElement?.offsetTop || 0) + (ref?.current?.parentElement?.clientHeight || 0)}px`);
  }, [isOpen]);

  const renderPanel = () => {
    switch (name) {
      case 'businessUnitsIds':
      case 'areasIds':
        return <BusinessUnitFilter data-id="8d6d89f0abef" />;

      case 'categoriesIds':
        return <CategoryFilter data-id="c432d9b786bc" />;

      case 'trackerItemsIds':
        return <TrackerItemFilter data-id="fc44cd86fb08" />;

      case 'locationsIds':
      case 'sitesIds':
        return <LocationFilter data-id="15788a2cb8cc" />;

      case 'regulatoryBodiesIds':
        return <RegulatoryBodyFilter data-id="5530f950aada" />;

      case 'usersIds':
        return <UserFilter data-id="70167d5c4b7a" />;

      default:
        return <StateChoiceFilter data-id="b8ffbd929fb8" name={name} />;
    }
  };

  const resetFilter = () => {
    const updatedFiltersValue = { ...filtersValues };
    updatedFiltersValue[name].value = [];
    setFilters({ filters: updatedFiltersValue });
  };

  return name.toLocaleLowerCase().includes('date') ? (
    <QuickDateFilter
      data-id="73006d6502a3"
      filterName={name}
      toggleActiveFilters={toggleActiveFilters} />
  ) : (
    <Flex
      data-id="8fd0e8be7868"
      direction="column"
      key={`quick-filter-item-${name}`}
      mt={2}>
      <Flex
        align="center"
        bg={isOpen ? 'quickFiltersItem.openBg' : 'quickFiltersItem.closeBg'}
        borderBottomRadius={isOpen ? '0px' : '10px'}
        borderTopRadius="10px"
        cursor="pointer"
        data-id="07f5508fc25c"
        direction="row"
        justify="center"
        mr={4}
        onClick={() => {
          onToggle();
          if (toggleActiveFilters) toggleActiveFilters();
        }}
        overflowY="auto"
        p={3}
        w="215px">
        <Text
          color="#1E1836"
          data-id="118a22fa9a2c"
          fontSize="14px"
          fontWeight="500"
          lineHeight="20px"
          w="full">
          {filter?.name}
        </Text>
        <Flex data-id="b219dbdf3ed3">
          {filtersLength > 0 && (
            <Box
              bg="quickFiltersItem.countBg"
              borderRadius="10px"
              color="quickFiltersItem.countColor"
              data-id="c9ff2f065648"
              fontSize="12px"
              fontWeight="400"
              mr="3"
              px="10px">
              {filtersLength}
            </Box>
          )}
          {filtersLength > 0 && <ResetIcon data-id="8a7ee6d40cb9" mr={3} onClick={resetFilter} />}
          {isOpen ? <ArrowUpIcon data-id="d4a1ac14534f" onClick={onToggle} /> : <ArrowDownIcon data-id="6d4ac126ff6e" onClick={onToggle} />}
        </Flex>
      </Flex>
      {isOpen && (
        <Flex
          align="center"
          alignItems="top"
          bg="quickFiltersItem.openBg"
          borderBottomRadius="10px"
          data-id="b32819eba480"
          maxH="200px"
          overflowY="auto"
          p={3}
          position="absolute"
          ref={ref}
          top={pos}
          w="215px">
          {isOpen && renderPanel()}
        </Flex>
      )}
    </Flex>
  );
}

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
