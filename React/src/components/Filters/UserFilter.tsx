import React, { useMemo, useState } from 'react';

import {
  Box,
  Flex,
  Input,
  InputGroup,
  Select,
  Spacer,
  Text,
} from '@chakra-ui/react';

import { userRoles } from '../../bootstrap/config';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import { ArrowDownIcon, CrossIcon, Magnifier } from '../../icons';
import { IUser } from '../../interfaces/IUser';
import UsersSelector from '../UsersSelector';

const UserFilter = () => {
  const { filtersValues, setFilters, users } = useFiltersContext();

  const [searchText, setSearchText] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('responsible');
  const selectedRoleUsers = useMemo(
    () => [
      {
        name: 'responsible',
        count: filtersValues.usersIds?.value?.responsibleIds?.length || 0,
      },
      {
        name: 'accountable',
        count: filtersValues.usersIds?.value?.accountableIds?.length || 0,
      },
      {
        name: 'contributor',
        count: filtersValues.usersIds?.value?.contributorIds?.length || 0,
      },
      {
        name: 'follower',
        count: filtersValues.usersIds?.value?.followerIds?.length || 0,
      },
    ],
    [filtersValues],
  );

  const selectedUsers = useMemo(() => {
    switch (selectedRole) {
      case 'responsible':
        return filtersValues.usersIds?.value?.responsibleIds;
      case 'accountable':
        return filtersValues.usersIds?.value?.accountableIds;
      case 'contributor':
        return filtersValues.usersIds?.value?.contributorIds;
      case 'follower':
        return filtersValues.usersIds?.value?.followerIds;
      default:
        break;
    }
  }, [filtersValues, selectedRole]) as string[];

  const handleUserChange = ({ target: { userRole, value } }) => {
    const userIdsFilter = filtersValues.usersIds?.value;
    switch (userRole) {
      case 'responsible':
        setFilters({
          usersIds: {
            ...userIdsFilter,
            responsibleIds: value,
          },
        });
        break;
      case 'accountable':
        setFilters({
          usersIds: {
            ...userIdsFilter,
            accountableIds: value,
          },
        });
        break;
      case 'contributor':
        setFilters({
          usersIds: {
            ...userIdsFilter,
            contributorIds: value,
          },
        });
        break;
      case 'follower':
        setFilters({
          usersIds: {
            ...userIdsFilter,
            followerIds: value,
          },
        });
        break;
      default:
        break;
    }
  };

  const handleClearFilter = (selectedRoleUser) => {
    const userIdsFilter = filtersValues.usersIds?.value;
    switch (selectedRoleUser.name) {
      case 'responsible':
        setFilters({
          usersIds: {
            ...userIdsFilter,
            responsibleIds: [],
          },
        });
        break;
      case 'accountable':
        setFilters({
          usersIds: {
            ...userIdsFilter,
            accountableIds: [],
          },
        });
        break;
      case 'contributor':
        setFilters({
          usersIds: {
            ...userIdsFilter,
            contributorIds: [],
          },
        });
        break;
      case 'follower':
        setFilters({
          usersIds: {
            ...userIdsFilter,
            followerIds: [],
          },
        });
        break;
      default:
        break;
    }
  };

  return (
    <Box w="full">
      <Select
        _active={{ bg: 'dropdown.activeBg' }}
        _disabled={{
          bg: 'dropdown.disabled.bg',
          color: 'dropdown.disabled.font',
          borderColor: 'dropdown.disabled.border',
          cursor: 'not-allowed',
        }}
        _focus={{
          borderColor: 'dropdown.border.normal',
        }}
        bg="dropdown.bg"
        borderColor="dropdown.border.normal"
        borderRadius="8px"
        borderWidth="1px"
        cursor="pointer"
        fontSize="smm"
        h="42px"
        icon={<ArrowDownIcon />}
        iconColor="usersSelector.roles.selector.iconDown"
        iconSize="15px"
        onChange={(value) => {
          setSelectedRole(value.target.value);
        }}
      >
        {userRoles.map((role, i) => (
          <option key={i} value={role.value}>
            {role.label}
          </option>
        ))}
      </Select>

      <InputGroup>
        <Input
          borderColor="filterPanel.searchBoxBordercolor"
          borderWidth="1px"
          color="brand.darkGrey"
          fontSize="14px"
          h="40px"
          mt={2}
          onChange={({ target: { value } }) => setSearchText(value)}
          pl={8}
          placeholder="Search user"
          value={searchText}
          w="full"
        />
        <Magnifier
          h="12px"
          ml="14px"
          mt="22px"
          position="absolute"
          w="12x"
        />
      </InputGroup>

      <Box mt={2} w="full">
        {selectedRoleUsers
          ?.filter((selectedRoleUser) => selectedRoleUser.count !== 0)
          .map((selectedRoleUser, i) => (
            <Flex key={i} py="5px">
              <Text
                color="usersSelector.roles.selectedRole.label"
                fontSize="smm"
                fontWeight="semi_medium"
                textTransform="capitalize"
              >
                {`${selectedRoleUser.count} ${selectedRoleUser.name}`}
              </Text>
              <Spacer />
              <CrossIcon
                cursor="pointer"
                h="15px"
                onClick={() => handleClearFilter(selectedRoleUser)}
                stroke="usersSelector.roles.selectedRole.crossIcon"
                w="15px"
              />
            </Flex>
          ))}
      </Box>

      <UsersSelector
        handleChange={handleUserChange}
        searchText={searchText}
        selected={selectedUsers}
        selectedRole={selectedRole}
        users={users as IUser[]}
      />
    </Box>
  );
};

export default UserFilter;
