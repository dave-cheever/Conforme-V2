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

function UsersSelectorList({ filteredUsers, selected, selectedRole, handleChange }: IUsersSelectorList) {
  return (
    <CheckboxGroup
      data-id="000514"
      onChange={(value) => handleChange({ target: { userRole: selectedRole, value } })}
      value={selected ?? []}>
      <Stack data-id="000515" direction="column" w="full">
         {filteredUsers
          ?.filter(user => user.displayName && user.displayName.trim() !== '')
          .map(({ displayName, _id, userId }) => (
            <FilterCheckBox data-id="000516" key={_id} label={displayName} value={userId} />
          ))}
        </Stack>
    </CheckboxGroup>
  );
}

export default UsersSelectorList;
