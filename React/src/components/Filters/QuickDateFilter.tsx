import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';

import { Box, Checkbox, Flex, Stack, Text, useDisclosure } from '@chakra-ui/react';
import { format } from 'date-fns';

import { useAppContext } from '../../contexts/AppProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import { actionsFilterDates, auditsFilterDates, trackerFilterDates } from '../../hooks/useFiltersUtils';
import useNavigate from '../../hooks/useNavigate';
import { CalendarIcon } from '../../icons';
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
      borderRadius="10px"
      data-id="000130"
      flexDir="column"
      justify="center"
      key={`quick-filter-item-${filterName}`}
      minW="215px"
      mt={2}
      my={2}
    >
      <Flex
        align="center"
        bg={isOpen ? 'filtersPanelItem.openBg' : 'filtersPanelItem.closeBg'}
        borderRadius="10px"
        cursor="pointer"
        data-id="000131"
        justify="space-between"
        mb="0.5"
        p="3"
        w="full"
      >
        <CalendarIcon data-id="000132" h="16px" mr="10px" stroke="#1E1836" w="16px" />
        <Text
          color="#1E1836"
          data-id="000133"
          fontSize="14px"
          fontWeight="500"
          lineHeight="20px"
          onClick={() => {
            onToggle();
            if (toggleActiveFilters) toggleActiveFilters();
          }}
          w="full"
        >
          {format(selectedDate, 'd MMMM yyyy')}
        </Text>
      </Flex>
      {isOpen && (
        <Flex borderRadius="10px" data-id="000134">
          <Box data-id="000135" display="flex" position="absolute">
            <Stack
              bg="#f0f2f5"
              borderRadius={`10px ${filterValue === 'exactDate' || filterValue === 'dateRange' ? '0 0' : '10px 10px'} 10px`}
              data-id="000136"
              direction="column"
              p="20px"
              w={filterValue === 'exactDate' || filterValue === 'dateRange' ? 'max-content' : '215px'}
            >
              {Object.entries(module?.type === 'tracker' ? trackerFilterDates : auditsUsedFilters).map(([key, label]) => (
                <Checkbox
                  css={{
                    '.chakra-checkbox__control': {
                      borderRadius: '50%',
                      width: '16px',
                      height: '16px',
                      borderWidth: '2px',
                      borderColor: '#A0AEC0', // default gray border
                      background: 'transparent',
                      boxShadow: 'none',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      '&[data-checked]': {
                        borderColor: '#005C96',
                        borderWidth: '5px',
                        background: 'transparent',
                      },
                    },
                  }}
                  data-id="000137"
                  icon={<span data-id="000138" />}
                  isChecked={value?.includes(key)}
                  key={key}
                  onChange={(e) => onChange(e, key)}
                >
                  <Text color="filterPanel.checkboxLabelColor" data-id="000139" fontSize="14px">
                    {label}
                  </Text>
                </Checkbox>
              ))}
            </Stack>
            <Flex className="quick-datePickerfilter" data-id="000140" dir="column">
              {filterValue === 'exactDate' && (
                <CustomDatePicker
                  clickOutsideHandler={onToggle}
                  data-id="000141"
                  inline
                  onChange={(date) => {
                    setSelectedDate(date);
                    setFilters({ [module?.type === 'tracker' ? 'dueDate' : filterName]: ['exactDate', date] });
                  }}
                  selected={startDate ? new Date(startDate) : new Date()}
                />
              )}
              {filterValue === 'dateRange' && (
                <CustomDatePicker
                  clickOutsideHandler={onToggle}
                  data-id="000142"
                  endDate={endDate ? new Date(endDate) : null}
                  inline
                  onChange={(dates) => {
                    const [start, end] = dates;
                    setFilters({ [module?.type === 'tracker' ? 'dueDate' : filterName]: ['dateRange', start, end] });
                  }}
                  selected={startDate}
                  selectsRange
                  startDate={startDate ? new Date(startDate) : new Date()}
                />
              )}
            </Flex>
          </Box>
        </Flex>
      )}
    </Flex>
  );
}

export default QuickDateFilter;
