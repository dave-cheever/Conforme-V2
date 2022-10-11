import DatePicker from 'react-datepicker';

import { ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, Select } from '@chakra-ui/react';
import { getMonth, getYear } from 'date-fns';
import { range } from 'lodash';

const years = range(1990, getYear(new Date()) + 1, 1);
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const CustomDatePicker = ({ clickOutsideHandler, ...props }) => (
  <DatePicker
    renderCustomHeader={({ date, changeYear, changeMonth }) => (
      <Flex borderRadius="10px" color="#1E1836" justify="space-around" minW="260px" p="8px 8px 8px 16px">
        <Select
          _focus={{
            outline: 'none',
          }}
          bg="filtersPanelItem.openBg"
          border="none"
          borderRadius="8px"
          cursor="pointer"
          fontSize="14px"
          fontWeight="400"
          icon={<ChevronDownIcon stroke="#787486" />}
          justifyContent="center"
          onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
          textAlign="center"
          value={months[getMonth(date)]}
        >
          {months.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
        <Select
          _focus={{
            outline: 'none',
          }}
          alignItems="center"
          border="none"
          borderRadius="8px"
          cursor="pointer"
          fontSize="14px"
          fontWeight="400"
          icon={<ChevronDownIcon stroke="#F4F3F5" />}
          justifyContent="center"
          onChange={({ target: { value } }) => changeYear(value)}
          textAlign="center"
          value={getYear(date)}
        >
          {years.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </Flex>
    )}
    {...props}
  />
);

export default CustomDatePicker;
