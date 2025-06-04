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
  return <CheckboxGroup
    data-id="052c105327fe"
    onChange={(value) => handleChange({ target: { userRole: selectedRole, value } })}
    value={selected ?? []}>
    <Stack data-id="397a34bc5fc8" direction="column" w="full">
       {filteredUsers
        ?.filter(user => user.displayName && user.displayName.trim() !== '')
        .map(({ displayName, _id }) => (
          <FilterCheckBox data-id="c4a86789c6fb" key={_id} label={displayName} value={_id} />
        ))}
      </Stack>
  </CheckboxGroup>
}

export default UsersSelectorList;
