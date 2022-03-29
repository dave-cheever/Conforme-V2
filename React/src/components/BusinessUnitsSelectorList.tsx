import React from 'react';

import { CheckboxGroup, Stack } from '@chakra-ui/react';

import { IBusinessUnit } from '../interfaces/IBusinessUnit';
import FilterCheckBox from './Filters/FilterCheckBox';

interface IBusinessUnitsSelectorList {
  filteredBusinessUnits: IBusinessUnit[];
  selected: string[];
  disabled?: boolean;
  handleChange: (any) => void;
}

const BusinessUnitsSelectorList = ({
  filteredBusinessUnits,
  selected,
  handleChange,
}: IBusinessUnitsSelectorList) => (
  <CheckboxGroup
    onChange={(value) =>
      handleChange({ target: { name: 'businessUnitsIds', value } })
    }
    value={selected}
  >
    <Stack direction="column" w="full">
      {filteredBusinessUnits?.map(({ name, _id }) => (
        <FilterCheckBox key={_id} label={name} value={_id} />
      ))}
    </Stack>
  </CheckboxGroup>
);

export default BusinessUnitsSelectorList;
