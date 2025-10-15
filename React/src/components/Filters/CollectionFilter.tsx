import React, { useMemo } from 'react';

import { Checkbox, CheckboxGroup, Stack, Text } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import { collections } from '../../hooks/useFiltersUtils';

function CollectionFilter() {
  const { filtersValues, setFilters } = useFiltersContext();
  const value = useMemo(() => filtersValues.collections?.value, [filtersValues]) as string[];

  return (
    <CheckboxGroup data-id="000106" onChange={(newValue) => setFilters({ collections: newValue })} value={value}>
      <Stack data-id="000107" direction="column" ml="4">
        {Object.entries(collections).map(([key, label]) => (
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
            data-id="000108"
            key={key}
            value={key}
          >
            <Text data-id="000109">{label as string}</Text>
          </Checkbox>
        ))}
      </Stack>
    </CheckboxGroup>
  );
}

export default CollectionFilter;
