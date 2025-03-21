import { useMemo } from 'react';
import DatePicker from 'react-datepicker';
import { isArray } from 'lodash';
import 'react-datepicker/dist/react-datepicker.css';
import { useLocation } from 'react-router-dom';

import { Box, Checkbox, Stack, Text } from '@chakra-ui/react';

import { useAppContext } from '../../contexts/AppProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import { actionsFilterDates, auditsFilterDates, trackerFilterDates } from '../../hooks/useFiltersUtils';
import useNavigate from '../../hooks/useNavigate';
import { MinusIcon } from '../../icons';

function DateFilter({ filterName }: { filterName: string }) {
  const { filtersValues, setFilters } = useFiltersContext();
  const { module } = useAppContext();
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
    () => (module?.type === 'tracker' ? filtersValues?.dueDate : auditsFiltersValue)?.value || [],
    [filtersValues, module?.type],
  );
  const [filterValue, startDate, endDate] = isArray(value) ? value :value.value || [];
  
  const onChange = (e, key) => {
    if (e.target.checked) 
      setFilters({ [module?.type === 'tracker' ? 'dueDate' : auditsOnChangeKey]: [key] });
    else 
      setFilters({ [module?.type === 'tracker' ? 'dueDate' : filterName]: null });
    
  };
  return (
    (<Box data-id="cfe370d3d087" w="full">
      <Stack data-id="3cbbb633a003" direction="column" mb={5}>
        {Object.entries(module?.type === 'tracker' ? trackerFilterDates : auditsUsedFilters).map(([key, label]) => (
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
            data-id="ba83bf0a23a2"
            icon={<MinusIcon data-id="993de56d9a90" />}
            isChecked={Array.isArray(value) && value.includes(key)}
            key={key}
            onChange={(e) => onChange(e, key)}>
            <Text
              color="filterPanel.checkboxLabelColor"
              data-id="468cd07c6a3d"
              fontSize="14px">
              {label}
            </Text>
          </Checkbox>
        ))}
      </Stack>
      {filterValue === 'exactDate' && (
        <DatePicker
          data-id="61275d36431e"
          inline
          onChange={(date) => setFilters({ [module?.type === 'tracker' || filterName==="createdDate" ?  'dueDate' : filterName]: module?.type === 'tracker' ? ['exactDate', date] : [['exactDate', date]] }) }
          selected={startDate ? new Date(startDate) : new Date()} />
      )}
      {filterValue === 'dateRange' && (
        <DatePicker
          data-id="9759578d957f"
          endDate={endDate ? new Date(endDate) : null}
          inline
          onChange={(date) => setFilters({ [module?.type === 'tracker'|| filterName==="createdDate" ? 'dueDate' : filterName]: [["dateRange", ...date || new Date()]] })}
          selected={startDate ? new Date(startDate) : null}
          selectsRange
          startDate={startDate ? new Date(startDate) : new Date()} />
      )}
    </Box>)
  );
}

export default DateFilter;
