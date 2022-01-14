import React, { useMemo, useState } from "react";
import {
  Box,
  Flex,
  InputGroup,
  Input,
  Select,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { useFiltersContext } from "../../contexts/FiltersProvider";
import { IUser } from "../../interfaces/IUser";
import { ArrowDownIcon, CrossIcon, Magnifier } from "../../icons";
import { userRoles } from "../../bootstrap/config";
import UsersSelector from "../UsersSelector";

const UserFilter = () => {
  const {
    filtersValues,
    setFilters,
    users,
  } = useFiltersContext();

  const [searchText, setSearchText] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>("responsible");
  const selectedRoleUsers = useMemo(() => [
    { name: 'responsible', count: filtersValues.usersIds?.value?.responsibleIds?.length || 0 },
    { name: 'accountable', count: filtersValues.usersIds?.value?.accountableIds?.length || 0 },
    { name: 'contributor', count: filtersValues.usersIds?.value?.contributorIds?.length || 0 },
    { name: 'follower', count: filtersValues.usersIds?.value?.followerIds?.length || 0 }
  ], [filtersValues]);

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
    }
  }, [filtersValues, selectedRole]) as string[];

  const handleUserChange = ({ target: { userRole, value } }) => {
    let userIdsFilter = filtersValues.usersIds?.value;
    switch (userRole) {
      case 'responsible':
        setFilters({
          usersIds: {
            ...userIdsFilter,
            'responsibleIds': value,
          }
        });
        break;
      case 'accountable':
        setFilters({
          usersIds: {
            ...userIdsFilter,
            'accountableIds': value,
          }
        });
        break;
      case 'contributor':
        setFilters({
          usersIds: {
            ...userIdsFilter,
            'contributorIds': value,
          }
        });
        break;
      case 'follower':
        setFilters({
          usersIds: {
            ...userIdsFilter,
            'followerIds': value,
          }
        });
        break;
    }
  };

  const handleClearFilter = (selectedRoleUser) => {
    let userIdsFilter = filtersValues.usersIds?.value;
    switch (selectedRoleUser.name) {
      case 'responsible':
        setFilters({
          usersIds: {
            ...userIdsFilter,
            'responsibleIds': [],
          }
        });
        break;
      case 'accountable':
        setFilters({
          usersIds: {
            ...userIdsFilter,
            'accountableIds': [],
          }
        });
        break;
      case 'contributor':
        setFilters({
          usersIds: {
            ...userIdsFilter,
            'contributorIds': [],
          }
        });
        break;
      case 'follower':
        setFilters({
          usersIds: {
            ...userIdsFilter,
            'followerIds': [],
          }
        });
        break;
    }
  }

  return (
    <Box w='full'>
      <Select
        onChange={value => {
          setSelectedRole(value.target.value);
        }}
        borderRadius="8px"
        borderWidth="1px"
        fontSize="smm"
        h="42px"
        bg="dropdown.bg"
        borderColor="dropdown.border.normal"
        cursor="pointer"
        _active={{ bg: "dropdown.activeBg" }}
        _focus={{
          borderColor: "dropdown.border.normal",
        }}
        _disabled={{
          bg: "dropdown.disabled.bg",
          color: "dropdown.disabled.font",
          borderColor: "dropdown.disabled.border",
          cursor: "not-allowed",
        }}
        icon={<ArrowDownIcon />}
        iconColor="usersSelector.roles.selector.iconDown"
        iconSize="15px"

      >
        {userRoles.map((role, i) => <option key={i} value={role.value}>{role.label}</option>)}
      </Select>

      <InputGroup>
        <Input
          borderWidth='1px'
          borderColor='filterPanel.searchBoxBordercolor'
          h='40px'
          w='full'
          mt={2}
          pl={8}
          color='brand.darkGrey'
          placeholder='Search user'
          value={searchText}
          fontSize="14px"
          onChange={({ target: { value } }) => setSearchText(value)}
        />
        <Magnifier alt="Search" h="12px" w='12x' position="absolute" mt="22px" ml="14px" />
      </InputGroup>

      <Box mt={2} w="full" align='center'>
        {selectedRoleUsers?.filter(selectedRoleUser => selectedRoleUser.count !== 0).map((selectedRoleUser, i) => (
          <Flex py="5px" key={i}>
            <Text
              fontSize="smm"
              textTransform="capitalize"
              color="usersSelector.roles.selectedRole.label"
              fontWeight="semi_medium"
            >
              {selectedRoleUser.count + " " + selectedRoleUser.name}
            </Text>
            <Spacer />
            <CrossIcon
              w="15px"
              h="15px"
              stroke="usersSelector.roles.selectedRole.crossIcon"
              onClick={() => handleClearFilter(selectedRoleUser)}
              cursor="pointer"
            />
          </Flex>
        ))}
      </Box>

      <UsersSelector
        users={users as IUser[]}
        selected={selectedUsers}
        handleChange={handleUserChange}
        selectedRole={selectedRole}
        searchText={searchText}
      />
    </Box>
  )
};

export default UserFilter;