import React, { useMemo } from "react";
import { Stack, RadioGroup, Radio } from '@chakra-ui/react';
// import Calendar from 'react-calendar';
import Flatpickr from 'react-flatpickr';

import { dates } from "../../hooks/useFiltersUtils";
import { useFiltersContext } from "../../contexts/FiltersProvider";

const DueDateFilter = () => {
  const {
    filtersValues,
    setFilters,
  } = useFiltersContext();
  const value = useMemo(() => filtersValues.dueDate?.value, [filtersValues]);
  const [filterValue, startDate, endDate] = value || [];

  return (
    <RadioGroup ml='4' mb='4' onChange={newValue => setFilters({ dueDate: [newValue] })} value={filterValue}>
      <Stack direction='column' overflow='auto' h='calc(100vh - 230px)'>
        {Object.entries(dates).map(([key, label]) => <Radio key={key} value={key}>{label}</Radio>)}

        {filterValue === 'exactDate' &&
          <Flatpickr
            className='flatpickr-input-hidden'
            options={{
              inline: true,
            }}
            onChange={(e: any) => setFilters({ dueDate: ['exactDate', e[0]] })}
            value={startDate ? new Date(startDate) : new Date()}
          />
        }

        {filterValue === 'dateRange' &&
          <Flatpickr
            className='flatpickr-input-hidden'
            options={{
              inline: true,
              mode: 'range',
            }}
            onChange={(e: any) => {
              if (e.length === 2) {
                setFilters({ dueDate: ['dateRange', e[0], e[1]] })
              }
            }}
            value={startDate ? (endDate ? [new Date(startDate), new Date(endDate)] : new Date(startDate)) : new Date()}
          />
        }
      </Stack>
    </RadioGroup>
  )
};

export default DueDateFilter;