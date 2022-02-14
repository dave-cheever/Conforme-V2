import React from "react";
import {
  CheckboxGroup,
  Stack,
} from "@chakra-ui/react";

import { IBusinessUnit } from "../interfaces/IBusinessUnit";
import FilterCheckBox from "./Filters/FilterCheckBox";

interface IBusinessUnitsSelectorList {
  filteredBusinessUnits: IBusinessUnit[];
  selected: string[];
  disabled?: boolean;
  handleChange: (any) => void;
}

const BusinessUnitsSelectorList = ({ filteredBusinessUnits, selected, disabled, handleChange }: IBusinessUnitsSelectorList) => {
  return (
    <CheckboxGroup
      value={selected}
      onChange={value => handleChange({ target: { name: 'businessUnitsIds', value } })}
    >
      <Stack w='full' direction="column">
        {filteredBusinessUnits?.map(({ name, _id }) => <FilterCheckBox label={name} key={_id} value={_id} />)}
      </Stack>
    </CheckboxGroup>
  );
};

export default BusinessUnitsSelectorList;
