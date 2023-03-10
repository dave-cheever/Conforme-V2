import { CheckboxGroup, Stack } from '@chakra-ui/react';

import { ILocation } from '../interfaces/ILocation';
import FilterCheckBox from './Filters/FilterCheckBox';

interface ILocationsSelectorList {
  filteredLocations: ILocation[];
  selected: string[];
  disabled?: boolean;
  handleChange: (any) => void;
}

const LocationsSelectorList = ({ filteredLocations, selected, handleChange }: ILocationsSelectorList) => (
  <CheckboxGroup
    data-id="a7f12bd3c709"
    onChange={(value) =>
      handleChange({
        target: {
          name: 'locationsIds',
          value,
        },
      })
    }
    value={selected}>
    <Stack data-id="21a4ca172a1e" direction="column" w="full">
      {filteredLocations?.map(({ name, _id }) => (
        <FilterCheckBox data-id="3fa39da31f38" key={_id} label={name} value={_id} />
      ))}
    </Stack>
  </CheckboxGroup>
);

export default LocationsSelectorList;
