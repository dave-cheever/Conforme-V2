import { useEffect, useState } from 'react';

import { Stack, Text } from '@chakra-ui/react';

import { IUser } from '../interfaces/IUser';
import UsersSelectorList from './UsersSelectorList';

interface IUsersSelector {
  users: IUser[];
  searchText: string;
  selected: string[];
  selectedRole: string;
  note?: string;
  disabled?: boolean;
  handleChange: (any) => void;
}

const UsersSelector = ({ users, searchText, selected, selectedRole, note, disabled, handleChange }: IUsersSelector) => {
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);

  useEffect(() => {
    let filteredUsers: IUser[] = [];
    if (disabled) filteredUsers = users?.filter(({ _id }) => selected?.includes(_id));
    else filteredUsers = users?.filter(({ displayName }) => displayName.toLowerCase().includes(searchText?.toLowerCase()));

    setFilteredUsers(filteredUsers);
  }, [users, disabled, selected, searchText]);

  // const toggleAll = useCallback(
  //   (event) => {
  //     const currentViewIds = filteredUsers.map(({ _id }) => _id);
  //     if (event.target.checked) {
  //       // Add all filtered users to selection
  //       const value = Array.from(new Set([...selected, ...currentViewIds]));
  //       handleChange({ target: { userRole: selectedRole, value } });
  //     } else {
  //       // Remove all filtered users from selection
  //       const value = selected.filter((_id) => !currentViewIds.includes(_id));
  //       handleChange({ target: { userRole: selectedRole, value } });
  //     }
  //   },

  //   [filteredUsers, selected],
  // );

  if (disabled) {
    return (
      <UsersSelectorList
        disabled={disabled}
        filteredUsers={filteredUsers}
        handleChange={handleChange}
        selected={selected}
        selectedRole={selectedRole}
      />
    );
  }

  return (
    <Stack w="full">
      <Stack overflow="auto" pb={3} w="full">
        <>
          {note && (
            <Text color="usersSelector.note" fontSize="12px" fontStyle="italic" opacity="0.3">
              {note}
            </Text>
          )}
          {selected?.length > 0 && (
            <UsersSelectorList
              disabled={disabled}
              filteredUsers={filteredUsers.filter((filteredUser) => selected?.includes(filteredUser._id))}
              handleChange={handleChange}
              selected={selected}
              selectedRole={selectedRole}
            />
          )}
          <UsersSelectorList
            disabled={disabled}
            filteredUsers={filteredUsers.filter((filteredUser) => !selected?.includes(filteredUser._id))}
            handleChange={handleChange}
            selected={selected}
            selectedRole={selectedRole}
          />
        </>
      </Stack>
    </Stack>
  );
};

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
