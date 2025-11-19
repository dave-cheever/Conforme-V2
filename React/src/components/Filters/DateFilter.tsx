import { useMemo, useState } from 'react';
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

  const onChange = (e, key) => {
    // For date filters, treat as radio buttons - only allow selection, not deselection
    // Deselection should only happen via the close icon
    if (e.target.checked) {
      const newValue = [key];
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
        if (key === 'exactDate' || key === 'dateRange') setShowCalendar(true);
      }
    }
    // If user clicks on already selected option, keep it selected and show calendar
    else if (selectedKey === key) {
      // Keep the current selection and show calendar
      if (key === 'exactDate' || key === 'dateRange') setShowCalendar(true);
    }
  };

  const handleExactDateChange = (date: Date) => {
    // Create a date at midnight UTC for the selected date to prevent timezone shifting
    // This ensures the exact date selected is used regardless of user's timezone
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const newVal = ['exactDate', utcDate];
    if (module && user) {
      updateLocalStorageFilter(
        module._id,
        filterKey,
        filterKey === 'dueDate' ? 'Expires on' : 'Created on',
        newVal,
        user?.userId,
        setFilters,
      );
      // Keep calendar open so user can change date if needed
      setShowCalendar(true);
    }
  };

  const handleRangeChange = (date: [Date | null, Date | null]) => {
    const [start, end] = date;

    if (start) {
      // Create dates at midnight UTC for the selected dates to prevent timezone shifting
      // This ensures the exact dates selected are used regardless of user's timezone
      const utcStartDate = new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate()));
      const utcEndDate = end ? new Date(Date.UTC(end.getFullYear(), end.getMonth(), end.getDate())) : null;
      const newVal = ['dateRange', utcStartDate, utcEndDate];

      if (module && user) {
        updateLocalStorageFilter(
          module._id,
          filterKey,
          filterKey === 'dueDate' ? 'Expires on' : 'Created on',
          newVal,
          user?.userId,
          setFilters,
        );
        // Keep calendar open so user can modify the range if needed
        setShowCalendar(true);
      }
    }
  };

  return (
    <Box data-id="000110" w="full">
      <style data-id="002461">{`
        .react-datepicker__year-dropdown {
          max-height: 200px !important;
          overflow-y: auto !important;
        }
        .react-datepicker__month-dropdown {
          max-height: 200px !important;
          overflow-y: auto !important;
        }
        .react-datepicker__year-select {
          max-height: 200px !important;
          overflow-y: auto !important;
        }
        .react-datepicker__month-select {
          max-height: 200px !important;
          overflow-y: auto !important;
        }
        .react-datepicker__month-read-view--down-arrow, .react-datepicker__year-read-view--down-arrow{
          margin-top:5px;
          width:8px;
          height:8px;
          }
      `}</style>
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
                // Prevent unchecking by clicking on already selected radio button
                '&[data-checked]:hover': {
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
            // Prevent unchecking by clicking on the control
            onClick={(e) => {
              if (selectedKey === key) {
                e.preventDefault();
                // Show calendar when clicking on already selected option
                if (key === 'exactDate' || key === 'dateRange') setShowCalendar(true);
              }
            }}
          >
            <Text color="filterPanel.checkboxLabelColor" data-id="000114" fontSize="14px">
              {label}
            </Text>
          </Checkbox>
        ))}
      </Stack>
      {filterValue === 'exactDate' && showCalendar && (
        <Box data-id="002462">
          <DatePicker
            data-id="000115"
            disabledKeyboardNavigation
            dropdownMode="scroll"
            inline
            onChange={handleExactDateChange}
            selected={startDate ? new Date(startDate) : null}
            showMonthDropdown
            showYearDropdown
            yearDropdownItemNumber={100}
          />
        </Box>
      )}
      {filterValue === 'dateRange' && showCalendar && (
        <Box data-id="002463">
          <DatePicker
            data-id="000116"
            disabledKeyboardNavigation
            dropdownMode="scroll"
            endDate={endDate ? new Date(endDate) : null}
            inline
            onChange={handleRangeChange}
            selected={startDate ? new Date(startDate) : null}
            selectsRange
            showMonthDropdown
            showYearDropdown
            startDate={startDate ? new Date(startDate) : null}
            yearDropdownItemNumber={100}
          />
        </Box>
      )}
    </Box>
  );
}

export default DateFilter;
