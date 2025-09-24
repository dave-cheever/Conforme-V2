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
      data-id="000502"
      onChange={(value) => handleChange({ target: { name: 'status', value } })}
      value={selected}>
      <Stack data-id="000503" direction="column" w="full">
        {filteredStatuses?.map((value) => (
          <FilterCheckBox
            data-id="000504"
            key={value}
            label={auditStatuses[value]}
            value={value} />
        ))}
      </Stack>
    </CheckboxGroup>
  );
}

export default StatusSelectorList;
