import { CheckboxGroup, Stack } from '@chakra-ui/react';

import { ILocation } from '../interfaces/ILocation';
import FilterCheckBox from './Filters/FilterCheckBox';

interface ILocationsSelectorList {
  filteredLocations: ILocation[];
  selected: string[];
  disabled?: boolean;
  handleChange: (any) => void;
}

function LocationsSelectorList({ filteredLocations, selected, handleChange }: ILocationsSelectorList) {
  return (
    <CheckboxGroup
      data-id="030925-180e2c"
      onChange={(value) =>
        handleChange({
          target: {
            name: 'locationsIds',
            value,
          },
        })
      }
      value={selected}>
      <Stack data-id="030925-2cab36" direction="column" w="full">
        {filteredLocations?.map(({ name, _id }) => (
          <FilterCheckBox data-id="030925-3fb728" key={_id} label={name} value={_id} />
        ))}
      </Stack>
    </CheckboxGroup>
  );
}

export default LocationsSelectorList;
