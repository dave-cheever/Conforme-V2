import { CheckboxGroup, Stack } from '@chakra-ui/react';

import { auditStatuses } from '../hooks/useAuditUtils';
import FilterCheckBox from './Filters/FilterCheckBox';

interface IStatusSelectorList {
  filteredStatuses: string[];
  selected: string[];
  disabled?: boolean;
  handleChange: (any) => void;
}

function StatusSelectorList({ filteredStatuses, selected, handleChange }: IStatusSelectorList) {
  return (
    <CheckboxGroup
      data-id="030925-f9573d"
      onChange={(value) => handleChange({ target: { name: 'status', value } })}
      value={selected}>
      <Stack data-id="030925-56d4a3" direction="column" w="full">
        {filteredStatuses?.map((value) => (
          <FilterCheckBox
            data-id="030925-bee1c8"
            key={value}
            label={auditStatuses[value]}
            value={value} />
        ))}
      </Stack>
    </CheckboxGroup>
  );
}

export default StatusSelectorList;
