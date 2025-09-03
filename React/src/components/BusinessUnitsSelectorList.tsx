import { CheckboxGroup, Stack } from '@chakra-ui/react';

import { IBusinessUnit } from '../interfaces/IBusinessUnit';
import FilterCheckBox from './Filters/FilterCheckBox';

interface IBusinessUnitsSelectorList {
  filteredBusinessUnits: IBusinessUnit[];
  selected: string[];
  disabled?: boolean;
  handleChange: (any) => void;
}

function BusinessUnitsSelectorList({ filteredBusinessUnits, selected, handleChange }: IBusinessUnitsSelectorList) {
  return (
    <CheckboxGroup
      data-id="030925-2fc2c1"
      onChange={(value) =>
        handleChange({
          target: {
            name: 'businessUnitsIds',
            value,
          },
        })
      }
      value={selected}>
      <Stack data-id="030925-a27765" direction="column" pb={2} w="full">
        {filteredBusinessUnits?.map(({ name, _id }) => (
          <FilterCheckBox data-id="030925-35bd91" key={_id} label={name} value={_id} />
        ))}
      </Stack>
    </CheckboxGroup>
  );
}

export default BusinessUnitsSelectorList;
