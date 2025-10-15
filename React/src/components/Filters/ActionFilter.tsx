import { useMemo } from 'react';

import { Checkbox, CheckboxGroup, Stack, Text } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import { actions } from '../../hooks/useFiltersUtils';

function ActionFilter() {
  const { filtersValues, setFilters } = useFiltersContext();
  const value = useMemo(() => filtersValues.action?.value, [filtersValues]) as string[];

  return (
    <CheckboxGroup data-id="000657" onChange={(newValue) => setFilters({ action: newValue })} value={value}>
      <Stack data-id="000658" direction="column" ml="4">
        {Object.entries(actions).map(([key, label]) => (
          <Checkbox
            css={{
              '.chakra-checkbox__control': {
                borderRadius: '4px', // Square corners for checkboxes
                width: '16px',
                height: '16px',
                borderWidth: '2px',
                borderColor: '#A0AEC0',
                background: 'transparent',
                '&[data-checked]': {
                  background: '#1C8586',
                  borderColor: '#1C8586',
                  '&[data-hover]': {
                    background: '#1C8586',
                    borderColor: '#1C8586',
                  },
                },
              },
              '.chakra-checkbox__icon': {
                color: 'white !important',
                fontSize: '12px !important',
                fontWeight: 'bold !important',
                display: 'block !important',
                opacity: '1 !important',
              },
            }}
            data-id="000659"
            key={key}
            value={key}
          >
            <Text data-id="000660">{label as string}</Text>
          </Checkbox>
        ))}
      </Stack>
    </CheckboxGroup>
  );
}

export default ActionFilter;
