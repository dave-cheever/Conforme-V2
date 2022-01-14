import React from "react";
import {
  CheckboxGroup,
  Stack,
} from "@chakra-ui/react";
import { IUser } from "../interfaces/IUser";
import FilterCheckBox from "./Filters/FilterCheckBox";

interface IUsersSelectorList {
  filteredUsers: IUser[];
  selected: string[];
  selectedRole: string;
  disabled?: boolean;
  handleChange: (any) => void;
}

const UsersSelectorList = ({ filteredUsers, selected, selectedRole, disabled, handleChange }: IUsersSelectorList) => {
  return (
    <CheckboxGroup
      value={selected}
      onChange={value => handleChange({ target: { userRole: selectedRole, value } })}
    >
      <Stack w='full' direction="column">
        {filteredUsers?.map(({ displayName, _id }) => <FilterCheckBox label={displayName} key={_id} value={_id} />)}
      </Stack>
    </CheckboxGroup >
  );
};

export default UsersSelectorList;
