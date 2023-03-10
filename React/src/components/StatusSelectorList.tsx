import { CheckboxGroup, Stack } from '@chakra-ui/react';

import { auditStatuses } from '../hooks/useAuditUtils';
import FilterCheckBox from './Filters/FilterCheckBox';

interface IStatusSelectorList {
  filteredStatuses: string[];
  selected: string[];
  disabled?: boolean;
  handleChange: (any) => void;
}

const StatusSelectorList = ({ filteredStatuses, selected, handleChange }: IStatusSelectorList) => (
  <CheckboxGroup
    data-id="983702cfe6d8"
    onChange={(value) => handleChange({ target: { name: 'status', value } })}
    value={selected}>
    <Stack data-id="2c0ec6e2b002" direction="column" w="full">
      {filteredStatuses?.map((value) => (
        <FilterCheckBox
          data-id="567d68187943"
          key={value}
          label={auditStatuses[value]}
          value={value} />
      ))}
    </Stack>
  </CheckboxGroup>
);

export default StatusSelectorList;
