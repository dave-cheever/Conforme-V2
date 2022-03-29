import React from 'react';

import { CheckboxGroup, Stack } from '@chakra-ui/react';

import { ILocation } from '../interfaces/ILocation';
import FilterCheckBox from './Filters/FilterCheckBox';

interface ILocationsSelectorList {
  filteredLocations: ILocation[];
  selected: string[];
  disabled?: boolean;
  handleChange: (any) => void;
}

const BusinessUnitsSelectorList = ({
  filteredLocations,
  selected,
  handleChange,
}: ILocationsSelectorList) => (
  <CheckboxGroup
    onChange={(value) =>
      handleChange({ target: { name: 'locationsIds', value } })
    }
    value={selected}
  >
    <Stack direction="column" w="full">
      {filteredLocations?.map(({ name, _id }) => (
        <FilterCheckBox key={_id} label={name} value={_id} />
      ))}
    </Stack>
  </CheckboxGroup>
);

export default BusinessUnitsSelectorList;
