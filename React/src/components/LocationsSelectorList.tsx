import { CheckboxGroup, Stack } from '@chakra-ui/react';

import { useAppContext } from '../contexts/AppProvider';
import { ILocation } from '../interfaces/ILocation';
import FilterCheckBox from './Filters/FilterCheckBox';

interface ILocationsSelectorList {
  filteredLocations: ILocation[];
  selected: string[];
  disabled?: boolean;
  handleChange: (any) => void;
}

const LocationsSelectorList = ({
  filteredLocations,
  selected,
  handleChange,
}: ILocationsSelectorList) => {
  const { module } = useAppContext();

  return (
    <CheckboxGroup
      onChange={(value) =>
        handleChange({
          target: {
            name: module?.type === 'tracker' ? 'locationsIds' : 'sitesIds',
            value,
          },
        })
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
};

export default LocationsSelectorList;
