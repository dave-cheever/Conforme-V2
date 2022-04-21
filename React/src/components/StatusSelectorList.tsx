import { CheckboxGroup, Stack } from '@chakra-ui/react';

import { auditStatuses } from '../hooks/useFiltersUtils';
import FilterCheckBox from './Filters/FilterCheckBox';

interface IStatusSelectorList {
  filteredStatuses: string[];
  selected: string[];
  disabled?: boolean;
  handleChange: (any) => void;
}

const StatusSelectorList = ({
  filteredStatuses,
  selected,
  handleChange,
}: IStatusSelectorList) => (
  <CheckboxGroup
    onChange={(value) => handleChange({ target: { name: 'status', value } })}
    value={selected}
  >
    <Stack direction="column" w="full">
      {filteredStatuses?.map((value) => (
        <FilterCheckBox
          key={value}
          label={auditStatuses[value]}
          value={value}
        />
      ))}
    </Stack>
  </CheckboxGroup>
);

export default StatusSelectorList;
