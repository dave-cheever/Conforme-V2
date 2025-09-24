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
      data-id="000181"
      onChange={(value) =>
        handleChange({
          target: {
            name: 'businessUnitsIds',
            value,
          },
        })
      }
      value={selected}>
      <Stack data-id="000182" direction="column" pb={2} w="full">
        {filteredBusinessUnits?.map(({ name, _id }) => (
          <FilterCheckBox data-id="000183" key={_id} label={name} value={_id} />
        ))}
      </Stack>
    </CheckboxGroup>
  );
}

export default BusinessUnitsSelectorList;
