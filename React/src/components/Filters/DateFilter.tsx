import { useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useLocation } from 'react-router-dom';

import { Box, Checkbox, Stack, Text } from '@chakra-ui/react';
import { isArray } from 'lodash';

import { useAppContext } from '../../contexts/AppProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import {
  actionsFilterDates,
  auditsFilterDates,
  trackerFilterDates,
} from '../../hooks/useFiltersUtils';
import useNavigate from '../../hooks/useNavigate';
import { MinusIcon } from '../../icons';
import updateLocalStorageFilter from '../../utils/filterStorage';

function DateFilter({ filterName }: { filterName: string }) {
  const { filtersValues, setFilters } = useFiltersContext();
  const { module, user } = useAppContext();
  const location = useLocation();
  const { getPath } = useNavigate();

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

  const value = (filtersValues?.[filterKey]?.value || []) as { value?: any[] } | any[];
  const [filterValue, startDate, endDate] = isArray(value) ? value : (value as { value?: any[] })?.value || [];
  const selectedKey = useMemo(() => {
  if (Array.isArray(value)) {
    if (Array.isArray(value[0])) return value[0][0]; // e.g., [["dateRange", date1, date2]]
    return value[0]; // e.g., ["exactDate"]
    }
    return null;
  }, [value]);

  const onChange = (e, key) => {
    const newValue = e.target.checked ? [key] : null;

    if(user && module)
    {updateLocalStorageFilter(
      module?.type,
      filterKey,
      filterKey === 'dueDate' ? 'Expires on' : 'Created on',
      newValue,
      user?._id,
      setFilters,
    );}
  };

  const handleExactDateChange = (date: Date) => {
    const newVal = ['exactDate', date];
    if(module && user)
      {updateLocalStorageFilter(
      module._id,
      filterKey,
      filterKey === 'dueDate' ? 'Expires on' : 'Created on',
      newVal,
      user?._id,
      setFilters,
    );}
  };

  const handleRangeChange = (date: [Date, Date]) => {
    const newVal = [['dateRange', ...date]];
    if(module && user)
    {updateLocalStorageFilter(
      module._id,
      filterKey,
      filterKey === 'dueDate' ? 'Expires on' : 'Created on',
      newVal,
      user?._id,
      setFilters,
    );}
  };

  return (
    <Box data-id="000110" w="full">
      <Stack data-id="000111" direction="column" mb={5}>
        {Object.entries(module?.type === 'tracker' ? trackerFilterDates : auditsUsedFilters).map(
          ([key, label]) => (
            <Checkbox
              data-id="000112"
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
              icon={<MinusIcon data-id="000113" />}
              isChecked={selectedKey === key}
              key={key}
              onChange={(e) => onChange(e, key)}
            >
              <Text
                data-id="000114"
                color="filterPanel.checkboxLabelColor"
                fontSize="14px"
              >
                {label}
              </Text>
            </Checkbox>
          ),
        )}
      </Stack>
      {filterValue === 'exactDate' && (
        <DatePicker
          data-id="000115"
          inline
          onChange={handleExactDateChange}
          selected={startDate ? new Date(startDate) : new Date()}
        />
      )}
      {filterValue === 'dateRange' && (
        <DatePicker
          data-id="000116"
          endDate={endDate ? new Date(endDate) : null}
          inline
          onChange={handleRangeChange}
          selected={startDate ? new Date(startDate) : null}
          selectsRange
          startDate={startDate ? new Date(startDate) : new Date()}
        />
      )}
    </Box>
  );
}

export default DateFilter;
