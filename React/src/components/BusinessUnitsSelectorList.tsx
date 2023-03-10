import { CheckboxGroup, Stack } from '@chakra-ui/react';

import { IBusinessUnit } from '../interfaces/IBusinessUnit';
import FilterCheckBox from './Filters/FilterCheckBox';

interface IBusinessUnitsSelectorList {
  filteredBusinessUnits: IBusinessUnit[];
  selected: string[];
  disabled?: boolean;
  handleChange: (any) => void;
}

const BusinessUnitsSelectorList = ({ filteredBusinessUnits, selected, handleChange }: IBusinessUnitsSelectorList) => (
  <CheckboxGroup
    data-id="d5eced54c75b"
    onChange={(value) =>
      handleChange({
        target: {
          name: 'businessUnitsIds',
          value,
        },
      })
    }
    value={selected}>
    <Stack data-id="e68c58abfbdf" direction="column" pb={2} w="full">
      {filteredBusinessUnits?.map(({ name, _id }) => (
        <FilterCheckBox data-id="e139a63d72e4" key={_id} label={name} value={_id} />
      ))}
    </Stack>
  </CheckboxGroup>
);

export default BusinessUnitsSelectorList;
