import { useMemo } from 'react';

import { Checkbox, CheckboxGroup, Stack, Text } from '@chakra-ui/react';

import { useFiltersContext } from '../../contexts/FiltersProvider';
import { actions } from '../../hooks/useFiltersUtils';

const ActionFilter = () => {
  const { filtersValues, setFilters } = useFiltersContext();
  const value = useMemo(() => filtersValues.action?.value, [filtersValues]) as string[];

  return (
    (<CheckboxGroup
      data-id="3a50dfda45b0"
      onChange={(newValue) => setFilters({ action: newValue })}
      value={value}>
      <Stack data-id="aed902f6725a" direction="column" ml="4">
        {Object.entries(actions).map(([key, label]) => (
          <Checkbox
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
            data-id="9faa580aa3d6"
            key={key}
            value={key}>
            <Text data-id="2c6b1db236c8">{label as string}</Text>
          </Checkbox>
        ))}
      </Stack>
    </CheckboxGroup>)
  );
};

export default ActionFilter;
