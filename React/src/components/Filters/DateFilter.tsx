import { useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useLocation } from 'react-router-dom';

import { Box, Checkbox, Stack, Text } from '@chakra-ui/react';
import { isArray } from 'lodash';
import 'react-datepicker/dist/react-datepicker.css';

import { useAppContext } from '../../contexts/AppProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import { actionsFilterDates, auditsFilterDates, trackerFilterDates } from '../../hooks/useFiltersUtils';
import useNavigate from '../../hooks/useNavigate';
import updateLocalStorageFilter from '../../utils/filterStorage';

function DateFilter({ filterName }: { filterName: string }) {
  const { filtersValues, setFilters } = useFiltersContext();
  const { module, user } = useAppContext();
  const location = useLocation();
  const { getPath } = useNavigate();

  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState<boolean>(true);

  const auditsUsedFilters = useMemo(() => {
    switch (getPath()) {
      case 'actions':
        return actionsFilterDates;
      case 'audits':
      default:
        return auditsFilterDates;
    }
  }, [getPath, location.pathname]);

  const filterKey = useMemo(() => {
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

  const value = (filtersValues?.[filterKey]?.value || []) as any[];
  const [filterValue, startDate, endDate] = isArray(value) ? value : [];
  const selectedKey = isArray(value) ? value[0] : null;

  // Update currentMonth when there's a selected date to show the correct month
  useEffect(() => {
    if (startDate && (filterValue === 'exactDate' || filterValue === 'dateRange')) setCurrentMonth(new Date(startDate));
  }, [startDate, filterValue]);

  const onChange = (e, key) => {
    const newValue = e.target.checked ? [key] : null;
    if (user && module) {
      updateLocalStorageFilter(
        module?.type,
        filterKey,
        filterKey === 'dueDate' ? 'Expires on' : 'Created on',
        newValue,
        user?.userId,
        setFilters,
      );
      // Show calendar when selecting a date filter option
      if (e.target.checked && (key === 'exactDate' || key === 'dateRange')) setShowCalendar(true);
    }
  };

  const handleExactDateChange = (date: Date) => {
    const newVal = ['exactDate', date];
    if (module && user) {
      updateLocalStorageFilter(
        module._id,
        filterKey,
        filterKey === 'dueDate' ? 'Expires on' : 'Created on',
        newVal,
        user?.userId,
        setFilters,
      );
      // Close calendar after selecting exact date
      setShowCalendar(false);
    }
  };

  const handleRangeChange = (date: [Date | null, Date | null]) => {
    const [start, end] = date;

    if (start) {
      const newVal = ['dateRange', start, end || null];

      if (module && user) {
        updateLocalStorageFilter(
          module._id,
          filterKey,
          filterKey === 'dueDate' ? 'Expires on' : 'Created on',
          newVal,
          user?.userId,
          setFilters,
        );
        // Close calendar when range is complete (both start and end selected)
        if (end) setShowCalendar(false);
      }
    }
  };

  const isSameMonthAndYear = (date1: Date, date2: Date) =>
    date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();

  return (
    <Box data-id="000110" w="full">
      <Stack data-id="000111" direction="column" mb={5}>
        {Object.entries(module?.type === 'tracker' ? trackerFilterDates : auditsUsedFilters).map(([key, label]) => (
          <Checkbox
            css={{
              '.chakra-checkbox__control': {
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                borderWidth: '2px',
                borderColor: '#A0AEC0',
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
            data-id="000112"
            icon={<span data-id="000113" />}
            isChecked={selectedKey === key}
            key={key}
            onChange={(e) => onChange(e, key)}
          >
            <Text color="filterPanel.checkboxLabelColor" data-id="000114" fontSize="14px">
              {label}
            </Text>
          </Checkbox>
        ))}
      </Stack>

      {filterValue === 'exactDate' && showCalendar && (
        <DatePicker
          data-id="000115"
          disabledKeyboardNavigation
          inline
          onChange={handleExactDateChange}
          onMonthChange={(date) => setCurrentMonth(date)}
          onYearChange={(date) => setCurrentMonth(date)}
          selected={startDate && currentMonth && isSameMonthAndYear(currentMonth, new Date(startDate)) ? startDate : null}
        />
      )}

      {filterValue === 'dateRange' && showCalendar && (
        <DatePicker
          data-id="000116"
          disabledKeyboardNavigation
          endDate={endDate || null}
          inline
          onChange={handleRangeChange}
          onMonthChange={(date) => setCurrentMonth(date)}
          onYearChange={(date) => setCurrentMonth(date)}
          selected={startDate && currentMonth && isSameMonthAndYear(currentMonth, new Date(startDate)) ? startDate : null}
          selectsRange
          startDate={startDate || null}
        />
      )}
    </Box>
  );
}

export default DateFilter;
