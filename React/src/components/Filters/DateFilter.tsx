import { useMemo } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';

import { Box, Checkbox, Stack, Text } from '@chakra-ui/react';

import { useAppContext } from '../../contexts/AppProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import { auditsFilterDates, trackerFilterDates } from '../../hooks/useFiltersUtils';
import { MinusIcon } from '../../icons';

const DateFilter = () => {
  const { filtersValues, setFilters } = useFiltersContext();
  const { module } = useAppContext();
  const value = useMemo(
    () => (module?.type === 'tracker' ? filtersValues.dueDate : filtersValues.createdDate)?.value,
    [filtersValues, module?.type],
  );
  const [filterValue, startDate, endDate] = value || [];

  const onChange = (e, key) => {
    if (e.target.checked) setFilters({ [module?.type === 'tracker' ? 'dueDate' : 'createdDate']: [key] });
    else setFilters({ [module?.type === 'tracker' ? 'dueDate' : 'createdDate']: [] });
  };

  return (
    <Box w="full">
      <Stack direction="column" mb={5}>
        {Object.entries(module?.type === 'tracker' ? trackerFilterDates : auditsFilterDates).map(([key, label]) => (
          <Checkbox
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
            icon={<MinusIcon />}
            isChecked={value?.includes(key)}
            key={key}
            onChange={(e) => onChange(e, key)}
          >
            <Text color="filterPanel.checkboxLabelColor" fontSize="14px">
              {label}
            </Text>
          </Checkbox>
        ))}
      </Stack>
      {filterValue === 'exactDate' && (
        <DatePicker
          inline
          onChange={(date) => setFilters({ [module?.type === 'tracker' ? 'dueDate' : 'createdDate']: ['exactDate', date] })}
          selected={startDate ? new Date(startDate) : new Date()}
        />
      )}

      {filterValue === 'dateRange' && (
        <DatePicker
          endDate={endDate ? new Date(endDate) : null}
          inline
          onChange={(dates) => {
            const [start, end] = dates;
            setFilters({ [module?.type === 'tracker' ? 'dueDate' : 'createdDate']: ['dateRange', start, end] });
          }}
          selected={startDate}
          selectsRange
          startDate={startDate ? new Date(startDate) : new Date()}
        />
      )}
    </Box>
  );
};

export default DateFilter;
