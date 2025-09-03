import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';

import { Box, Checkbox, Flex, Stack, Text, useDisclosure } from '@chakra-ui/react';
import { format } from 'date-fns';

import { useAppContext } from '../../contexts/AppProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import { actionsFilterDates, auditsFilterDates, trackerFilterDates } from '../../hooks/useFiltersUtils';
import useNavigate from '../../hooks/useNavigate';
import { CalendarIcon, MinusIcon } from '../../icons';
import CustomDatePicker from './CustomDatePicker';

function QuickDateFilter({ filterName, toggleActiveFilters }: { filterName: string; toggleActiveFilters?: () => void }) {
  const { filtersValues, setFilters } = useFiltersContext();
  const { module } = useAppContext();
  const location = useLocation();
  const { getPath } = useNavigate();

  const { isOpen, onToggle } = useDisclosure();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const auditsUsedFilters = useMemo(() => {
    switch (getPath()) {
      case 'actions':
        return actionsFilterDates;
      case 'audits':
      default:
        return auditsFilterDates;
    }
  }, [location.pathname]);

  const auditsFiltersValue = useMemo(() => {
    switch (getPath()) {
      case 'actions':
        return filtersValues.dueDate;
      case 'answers':
        return filtersValues.createdDate;
      case 'audits':
      default:
        return filtersValues[filterName];
    }
  }, [location.pathname]);

  const auditsOnChangeKey = useMemo(() => {
    switch (getPath()) {
      case 'actions':
        return 'dueDate';
      case 'answers':
        return 'createdDate';
      case 'audits':
      default:
        return filterName;
    }
  }, [location.pathname]);

  const value = useMemo(
    () => (module?.type === 'tracker' ? filtersValues.dueDate : auditsFiltersValue)?.value,
    [filtersValues, module?.type],
  );
  const [filterValue, startDate, endDate] = value || [];

  const onChange = (e, key) => {
    if (e.target.checked) setFilters({ [module?.type === 'tracker' ? 'dueDate' : auditsOnChangeKey]: [key] });
    else setFilters({ [module?.type === 'tracker' ? 'dueDate' : filterName]: [] });
  };

  return (
    <Flex
        data-id="030925-0d5c61"
        borderRadius="10px"
        flexDir="column"
        justify="center"
        key={`quick-filter-item-${filterName}`}
        minW="215px"
        mt={2}
        my={2}>
      <Flex
        data-id="030925-c00f79"
        align="center"
        bg={isOpen ? 'filtersPanelItem.openBg' : 'filtersPanelItem.closeBg'}
        borderRadius="10px"
        cursor="pointer"
        justify="space-between"
        mb="0.5"
        p="3"
        w="full">
        <CalendarIcon data-id="030925-fb14b4" h="16px" mr="10px" stroke="#1E1836" w="16px" />
        <Text
          data-id="030925-6447e7"
          color="#1E1836"
          fontSize="14px"
          fontWeight="500"
          lineHeight="20px"
          onClick={() => {
            onToggle();
            if (toggleActiveFilters) toggleActiveFilters();
          }}
          w="full">
          {format(selectedDate, 'd MMMM yyyy')}
        </Text>
      </Flex>
      {isOpen && (
        <Flex data-id="030925-ffc61e" borderRadius="10px">
          <Box data-id="030925-ba4cc0" display="flex" position="absolute">
            <Stack
              data-id="030925-974d2c"
              bg="#f0f2f5"
              borderRadius={`10px ${filterValue === 'exactDate' || filterValue === 'dateRange' ? '0 0' : '10px 10px'} 10px`}
              direction="column"
              p="20px"
              w={filterValue === 'exactDate' || filterValue === 'dateRange' ? 'max-content' : '215px'}>
              {Object.entries(module?.type === 'tracker' ? trackerFilterDates : auditsUsedFilters).map(([key, label]) => (
                <Checkbox
                  data-id="030925-2a194e"
                  colorScheme="purpleHeart"
                  css={{
                    '.chakra-checkbox__control': {
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      background: 'white',
                      borderWidth: '1px',
                      borderColor: '#81819750',
                      '&[data-checked]': {
                        background: '#462AC4',
                        borderColor: '#462AC4',
                        '&[data-hover]': {
                          background: '#462AC4',
                          borderColor: '#462AC4',
                        },
                      },
                    },
                  }}
                  icon={<MinusIcon data-id="030925-4c1f33" />}
                  isChecked={value?.includes(key)}
                  key={key}
                  onChange={(e) => onChange(e, key)}>
                  <Text
                    data-id="030925-67bc72"
                    color="filterPanel.checkboxLabelColor"
                    fontSize="14px">
                    {label}
                  </Text>
                </Checkbox>
              ))}
            </Stack>
            <Flex data-id="030925-476dfe" className="quick-datePickerfilter" dir="column">
              {filterValue === 'exactDate' && (
                <CustomDatePicker
                  data-id="030925-8a3feb"
                  clickOutsideHandler={onToggle}
                  inline
                  onChange={(date) => {
                    setSelectedDate(date);
                    setFilters({ [module?.type === 'tracker' ? 'dueDate' : filterName]: ['exactDate', date] });
                  }}
                  selected={startDate ? new Date(startDate) : new Date()} />
              )}
              {filterValue === 'dateRange' && (
                <CustomDatePicker
                  data-id="030925-787505"
                  clickOutsideHandler={onToggle}
                  endDate={endDate ? new Date(endDate) : null}
                  inline
                  onChange={(dates) => {
                    const [start, end] = dates;
                    setFilters({ [module?.type === 'tracker' ? 'dueDate' : filterName]: ['dateRange', start, end] });
                  }}
                  selected={startDate}
                  selectsRange
                  startDate={startDate ? new Date(startDate) : new Date()} />
              )}
            </Flex>
          </Box>
        </Flex>
      )}
    </Flex>
  );
}

export default QuickDateFilter;
