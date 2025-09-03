import { useEffect, useState } from 'react';

import { Stack, Text } from '@chakra-ui/react';

import { IUser } from '../interfaces/IUser';
import UsersSelectorList from './UsersSelectorList';

interface IUsersSelector {
  allowUnassigned?: boolean;
  users: IUser[];
  searchText: string;
  selected: string[];
  selectedRole: string;
  note?: string;
  disabled?: boolean;
  handleChange: (any) => void;
}

function UsersSelector({
  allowUnassigned = false,
  users,
  searchText,
  selected,
  selectedRole,
  note,
  disabled,
  handleChange,
}: IUsersSelector) {
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);

  useEffect(() => {
    const _users = allowUnassigned ? [{ _id: 'unassigned', displayName: 'Unassigned' } as IUser, ...users] : [...users];
    let filteredUsers: IUser[] = [];
    if (disabled) filteredUsers = _users?.filter(({ _id }) => selected?.includes(_id));
    else filteredUsers = _users?.filter(({ displayName }) => displayName.toLowerCase().includes(searchText?.toLowerCase()));

    setFilteredUsers(filteredUsers);
  }, [allowUnassigned, users, disabled, selected, searchText]);

  if (disabled) {
    return (
      <UsersSelectorList
          data-id="030925-0d3e11"
          disabled={disabled}
          filteredUsers={filteredUsers}
          handleChange={handleChange}
          selected={selected}
          selectedRole={selectedRole} />
    );
  }

  return (
    <Stack data-id="030925-fadb47" w="full">
      <Stack data-id="030925-aeca86" overflow="auto" pb={3} w="full">
        <>
          {note && (
            <Text
              data-id="030925-7a5184"
              color="usersSelector.note"
              fontSize="12px"
              fontStyle="italic"
              opacity="0.3">
              {note}
            </Text>
          )}
          {selected?.length > 0 && (
            <UsersSelectorList
              data-id="030925-e64ce7"
              disabled={disabled}
              filteredUsers={filteredUsers.filter((filteredUser) => selected?.includes(filteredUser.userId))}
              handleChange={handleChange}
              selected={selected}
              selectedRole={selectedRole} />
          )}
          <UsersSelectorList
            data-id="030925-8677d4"
            disabled={disabled}
            filteredUsers={filteredUsers.filter((filteredUser) => !selected?.includes(filteredUser.userId))}
            handleChange={handleChange}
            selected={selected}
            selectedRole={selectedRole} />
        </>
      </Stack>
    </Stack>
  );
}

export default UsersSelector;

export const userSelectorStyles = {
  usersSelector: {
    label: '#777777',
    border: {
      normal: '#CBCCCD',
      focus: '#777777',
    },
    note: '#424B50',
    checkbox: {
      border: '#CBCCCD',
      500: '#462AC4',
    },
    list: {
      checkbox: {
        border: '#CBCCCD',
        500: '#462AC4',
      },
      font: {
        normal: '#777777',
        selected: '#FFFFFF',
      },
    },
    roles: {
      selector: {
        iconDown: '#282F36',
        color: '#282F36',
      },
      selectedRole: {
        label: '#282F36',
        crossIcon: '#282F36',
      },
    },
  },
};
