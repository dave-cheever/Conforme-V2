import React, { useMemo } from "react";
import { Stack, Box, Checkbox, Text } from '@chakra-ui/react';
// import Calendar from 'react-calendar';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from  'react-datepicker';


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
    <Box w="full" className="dueDate">
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
                colorScheme="purpleHeart"
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
          <DatePicker
            onChange={(date) => setFilters({ dueDate: ['exactDate',date] })}
            selected={startDate ? new Date(startDate) : new Date()}
            inline
          />
        }

        {filterValue === 'dateRange' &&
          <DatePicker
            selected={startDate}
            onChange={(dates) => {
              const [start, end] = dates;
              setFilters({ dueDate: ['dateRange', start, end]});
            }}
            startDate={startDate ? new Date(startDate): new Date()}
            endDate={endDate ? new Date(endDate): null}
            selectsRange
            inline
          />
        }
    </Box>
  )
};

export default DueDateFilter;