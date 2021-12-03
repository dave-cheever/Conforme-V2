import React, { useMemo } from "react";
import { Stack, Box, Checkbox, Text } from '@chakra-ui/react';
// import Calendar from 'react-calendar';
import Flatpickr from 'react-flatpickr';

import { dates } from "../../hooks/useFiltersUtils";
import { MinusIcon } from "../../icons";
import { useFiltersContext } from "../../contexts/FiltersProvider";

const DueDateFilter = () => {
  const {
    filtersValues,
    setFilters,
  } = useFiltersContext();
  const value = useMemo(() => filtersValues.dueDate?.value, [filtersValues]);
  const [filterValue, startDate, endDate] = value || [];

  const onChange = (e, key) => {
    if(e.target.checked){
      setFilters({ dueDate: [key] });
    } else{
      setFilters({ dueDate: []});
    }
  }

  return (
    <Box>
      <Stack direction='column' mb={5}>
        {Object.entries(dates).map(([key, label]) => 
            <Checkbox
            css={{
                ".chakra-checkbox__control": {
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                background:"white",
                borderWidth:"1px",
                borderColor: "#81819750",
                "&[data-checked]": {
                    background: "#462AC4",
                    borderColor: "#462AC4",
                "&[data-hover]": {
                    background: "#462AC4",
                    borderColor: "#462AC4"
                    }
                }
            }
            }}
            icon={<MinusIcon/>}
            key={key}
            onChange={(e) => onChange(e, key)}
            isChecked={value?.includes(key)}
            >
            <Text fontSize="14px" color="filterPanel.checkboxLabelColor">{label}</Text>
        </Checkbox>
        )}
      </Stack>
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
    </Box>
  )
};

export default DueDateFilter;