import { useMemo } from 'react';

import { Checkbox, CheckboxGroup, Stack, Text } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import { actions } from '../../hooks/useFiltersUtils';

function ActionFilter() {
  const { filtersValues, setFilters } = useFiltersContext();
  const value = useMemo(() => filtersValues.action?.value, [filtersValues]) as string[];

  return (
    <CheckboxGroup
        data-id="030925-48e8e1"
        onChange={(newValue) => setFilters({ action: newValue })}
        value={value}>
      <Stack data-id="030925-5113a0" direction="column" ml="4">
        {Object.entries(actions).map(([key, label]) => (
          <Checkbox
            data-id="030925-227eca"
            css={{
              '.chakra-checkbox__control': {
                borderRadius: '50%',
                width: '21px',
                height: '21px',
                '&[data-checked]': {
                  background: '#1C8586',
                  borderColor: '#1C8586',
                  '&[data-hover]': {
                    background: '#1C8586',
                    borderColor: '#1C8586',
                  },
                },
              },
            }}
            key={key}
            value={key}>
            <Text data-id="030925-b0b7bd">{label as string}</Text>
          </Checkbox>
        ))}
      </Stack>
    </CheckboxGroup>
  );
}

export default ActionFilter;
