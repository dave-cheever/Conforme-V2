import React from 'react';
import { Box, Flex, Button } from '@chakra-ui/react';

import { ChevronRight } from '../../icons';
import CategoryFilter from './CategoryFilter';
import ItemStatusFilter from './ItemStatusFilter';
import RegulatoryBodyFilter from './RegulatoryBodyFilter';
import BusinessUnitFilter from './BusinessUnitFilter';
import DueDateFilter from './DueDateFilter';
import IsVerifiedFilter from './IsVerifiedFilter';
import CollectionFilter from './CollectionFilter';
import ActionFilter from './ActionFilter';
import UserFilter from './UserFilter';
import ComplianceItemFilter from './ComplianceItemFilter';
import FunctionalAreaFilter from './FunctionalAreaFilter';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import { initialFilters } from '../../hooks/useFiltersUtils';
import FiltersPanelItem from './FiltersPanelItem';

const FiltersPanel = () => {
  const {
    filtersValues,
    usedFilters,
    showFiltersPanel, setShowFiltersPanel,
    openedFilterPanel, setOpenedFilterPanel,
    setFilters, cleanFilters,
  } = useFiltersContext();

  if (!showFiltersPanel) {
    return null;
  }
  return (
    <Box position='absolute' borderWidth={1} borderTopWidth={0} overflow='auto' borderColor='brand.divider' zIndex='10' h={['calc(100vh - 122px)', 'calc(100vh - 160px)']} w={['100%', '290px']} right={[0, 2]} mt='-18px' rounded={[0, 'lg']} flexShrink={0} bg='#FFFFFF'>
      <Box w='10px' h='10px' mt='-6px' ml={['calc(100% - 85px)', '215px']} transform='rotate(45deg)' bg='brand.primary' />
      {!openedFilterPanel ?
        <>
          <Flex justify='space-between' align='center' h='65px' px='4' borderBottomWidth={1} borderBottomColor='brand.divider'>
            <Box color='brand.darkGrey' fontWeight='700'>Filters</Box>
            <Flex>
              <Button _hover={{ opacity: 0.7 }} color="brand.primaryFont" size='sm' h='27px' w='61px' bg='brand.paleGrey' onClick={cleanFilters}>Clear</Button>
              <Button _hover={{ opacity: 0.7 }} color="brand.primaryFont" ml='10px' size='sm' h='27px' w='61px' bg='brand.bmiGreen' onClick={() => setShowFiltersPanel(false)}>Done</Button>
            </Flex>
          </Flex>
          {Object.entries(filtersValues).map(([name, value]) => {
            if (usedFilters.includes(name)) {
              return <FiltersPanelItem key={name} name={name} filter={value} />;
            }
            return null
          })}
        </>
        :
        <>
          <Flex align='center' h='65px' px='4' cursor='pointer' onClick={() => setOpenedFilterPanel(null)}>
            <ChevronRight transform='rotate(180deg)' />
            <Box color='brand.darkGrey' fontWeight='700' pl='2'>{initialFilters[openedFilterPanel].name}</Box>
            <Flex ml="auto">
              <Button
                _hover={{ opacity: 0.7 }}
                color="brand.primaryFont"
                size='sm'
                h='27px'
                w='61px'
                bg='brand.paleGrey'
                onClick={() => setFilters({ [openedFilterPanel]: initialFilters[openedFilterPanel].value })} // Reset filter
              >Clear</Button>
            </Flex>
          </Flex>
          {
            {
              complianceItems: <ComplianceItemFilter />,
              category: <CategoryFilter />,
              functionalAreas: <FunctionalAreaFilter />,
              businessUnits: <BusinessUnitFilter />,
              itemStatus: <ItemStatusFilter />,
              regulatoryBody: <RegulatoryBodyFilter />,
              dueDate: <DueDateFilter />,
              isVerified: <IsVerifiedFilter />,
              collection: <CollectionFilter />,
              action: <ActionFilter />,
              users: <UserFilter />,
            }[openedFilterPanel]
          }
        </>}
    </Box>
  );
};

export default FiltersPanel;
