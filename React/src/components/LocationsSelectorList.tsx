import React from "react";
import {
  CheckboxGroup,
  Stack,
} from "@chakra-ui/react";

import { ILocation } from "../interfaces/ILocation";
import FilterCheckBox from "./Filters/FilterCheckBox";

interface ILocationsSelectorList {
  filteredLocations: ILocation[];
  selected: string[];
  disabled?: boolean;
  handleChange: (any) => void;
}

const BusinessUnitsSelectorList = ({ filteredLocations, selected, disabled, handleChange }: ILocationsSelectorList) => {
  return (
    <CheckboxGroup
      value={selected}
      onChange={value => handleChange({ target: { name: 'locationsIds', value } })}
    >
      <Stack w='full' direction="column">
        {filteredLocations?.map(({ name, _id }) => <FilterCheckBox label={name} key={_id} value={_id} />)}
      </Stack>
    </CheckboxGroup>
  );
};

export default BusinessUnitsSelectorList;
