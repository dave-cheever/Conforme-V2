import React from 'react';

import { CheckboxGroup, Stack } from '@chakra-ui/react';

import { IUser } from '../interfaces/IUser';
import FilterCheckBox from './Filters/FilterCheckBox';

interface IUsersSelectorList {
  filteredUsers: IUser[];
  selected: string[];
  selectedRole: string;
  disabled?: boolean;
  handleChange: (any) => void;
}

const UsersSelectorList = ({
  filteredUsers,
  selected,
  selectedRole,
  handleChange,
}: IUsersSelectorList) => (
  <CheckboxGroup
    onChange={(value) =>
      handleChange({ target: { userRole: selectedRole, value } })
    }
    value={selected}
  >
    <Stack direction="column" w="full">
      {filteredUsers?.map(({ displayName, _id }) => (
        <FilterCheckBox key={_id} label={displayName} value={_id} />
      ))}
    </Stack>
  </CheckboxGroup>
);

export default UsersSelectorList;
