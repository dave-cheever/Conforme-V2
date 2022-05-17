import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import {
  Box,
  Flex,
  Input,
  InputGroup,
  Select,
  Spacer,
  Text,
} from '@chakra-ui/react';

import {
  actionUserRoles,
  auditUserRoles,
  userRoles,
  walkItemUserRoles,
} from '../../bootstrap/config';
import { useAppContext } from '../../contexts/AppProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import useNavigate from '../../hooks/useNavigate';
import { ArrowDownIcon, CrossIcon, Magnifier } from '../../icons';
import {
  IActionUserFilter,
  IAuditUserFilter,
  IUserFilter,
  IWalkItemUserFilter,
} from '../../interfaces/IFilters';
import { IUser } from '../../interfaces/IUser';
import UsersSelector from '../UsersSelector';

const UserFilter = () => {
  const { module } = useAppContext();
  const location = useLocation();
  const { getPath } = useNavigate();
  const { filtersValues, setFilters, users } = useFiltersContext();
  const [searchText, setSearchText] = useState<string>('');

  const auditSelectedUserRole = useMemo(() => {
    switch (getPath()) {
      case 'actions':
        return 'assignee';
      case 'walk-items':
        return 'addedBy';
      case 'audits':
      default:
        return 'auditor';
    }
  }, [location.pathname]);
  const [selectedRole, setSelectedRole] = useState<string>(
    module?.type === 'tracker' ? 'responsible' : auditSelectedUserRole,
  );

  const baseAuditUserRoles = useMemo(() => {
    switch (getPath()) {
      case 'actions':
        return actionUserRoles;
      case 'walk-items':
        return walkItemUserRoles;
      case 'audits':
      default:
        return auditUserRoles;
    }
  }, [location.pathname]);
  const auditUserIdsFilter = useMemo(() => {
    switch (getPath()) {
      case 'actions':
        return filtersValues.usersIds as IActionUserFilter;
      case 'walkItems':
        return filtersValues.usersIds as IWalkItemUserFilter;
      case 'audits':
      default:
        filtersValues.usersIds as IAuditUserFilter;
    }
  }, [location.pathname]);
  const selectedAuditRoleUsers = useMemo(() => {
    switch (getPath()) {
      case 'actions':
        return [
          {
            name: 'assignee',
            count:
              (filtersValues.usersIds as IActionUserFilter)?.value?.assigneesIds
                ?.length || 0,
          },
        ];
      case 'walk-items':
        return [
          {
            name: 'addedBy',
            count:
              (filtersValues.usersIds as IWalkItemUserFilter)?.value?.addedByIds
                ?.length || 0,
          },
        ];
      case 'audits':
      default:
        return [
          {
            name: 'auditor',
            count:
              (filtersValues.usersIds as IAuditUserFilter)?.value?.auditorsIds
                ?.length || 0,
          },
          {
            name: 'participant',
            count:
              (filtersValues.usersIds as IAuditUserFilter)?.value
                ?.participantsIds?.length || 0,
          },
        ];
    }
  }, [location.pathname]);
  const selectedRoleUsers = useMemo(
    () =>
      module?.type === 'tracker'
        ? [
            {
              name: 'responsible',
              count:
                (filtersValues.usersIds as IUserFilter)?.value?.responsibleIds
                  ?.length || 0,
            },
            {
              name: 'accountable',
              count:
                (filtersValues.usersIds as IUserFilter)?.value?.accountableIds
                  ?.length || 0,
            },
            {
              name: 'contributor',
              count:
                (filtersValues.usersIds as IUserFilter)?.value?.contributorIds
                  ?.length || 0,
            },
            {
              name: 'follower',
              count:
                (filtersValues.usersIds as IUserFilter)?.value?.followerIds
                  ?.length || 0,
            },
          ]
        : selectedAuditRoleUsers,
    [filtersValues, module, location.pathname],
  );

  const selectedUsers = useMemo(() => {
    switch (selectedRole) {
      case 'responsible':
        return (filtersValues.usersIds as IUserFilter)?.value?.responsibleIds;
      case 'accountable':
        return (filtersValues.usersIds as IUserFilter)?.value?.accountableIds;
      case 'contributor':
        return (filtersValues.usersIds as IUserFilter)?.value?.contributorIds;
      case 'follower':
        return (filtersValues.usersIds as IUserFilter)?.value?.followerIds;
      case 'auditor':
        return (filtersValues.usersIds as IAuditUserFilter)?.value?.auditorsIds;
      case 'assignee':
        return (filtersValues.usersIds as IActionUserFilter)?.value
          ?.assigneesIds;
      case 'addedBy':
        return (filtersValues.usersIds as IWalkItemUserFilter)?.value
          ?.addedByIds;
      case 'participant':
        return (filtersValues.usersIds as IAuditUserFilter)?.value
          ?.participantsIds;
      default:
        break;
    }
  }, [filtersValues, selectedRole, location.pathname]) as string[];

  const handleUserChange = ({ target: { userRole, value } }) => {
    const userIdsFilter = (filtersValues.usersIds as IUserFilter)?.value;
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

  const handleAuditUserChange = ({ target: { userRole, value } }) => {
    const userIdsFilter = auditUserIdsFilter?.value;
    switch (userRole) {
      case 'auditor':
        setFilters({
          usersIds: {
            ...userIdsFilter,
            auditorsIds: value,
          },
        });
        break;
      case 'assignee':
        setFilters({
          usersIds: {
            ...userIdsFilter,
            assigneesIds: value,
          },
        });
        break;
      case 'addedBy':
        setFilters({
          usersIds: {
            ...userIdsFilter,
            addedByIds: value,
          },
        });
        break;
      case 'participant':
        setFilters({
          usersIds: {
            ...userIdsFilter,
            participantsIds: value,
          },
        });
        break;
      default:
        break;
    }
  };

  const handleClearFilter = (selectedRoleUser) => {
    const userIdsFilter = (filtersValues.usersIds as IUserFilter)?.value;

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

  const handleClearAuditFilter = (selectedRoleUser) => {
    const userIdsFilter = auditUserIdsFilter?.value;

    switch (selectedRoleUser.name) {
      case 'auditor':
        setFilters({
          usersIds: {
            ...userIdsFilter,
            auditorsIds: [],
          },
        });
        break;
      case 'assignee':
        setFilters({
          usersIds: {
            ...userIdsFilter,
            assigneesIds: [],
          },
        });
        break;
      case 'addedBy':
        setFilters({
          usersIds: {
            ...userIdsFilter,
            addedByIds: [],
          },
        });
        break;
      case 'participant':
        setFilters({
          usersIds: {
            ...userIdsFilter,
            participantsIds: [],
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
        {(module?.type === 'tracker' ? userRoles : baseAuditUserRoles).map(
          (role, i) => (
            <option key={i} value={role.value}>
              {role.label}
            </option>
          ),
        )}
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
        <Magnifier h="12px" ml="14px" mt="22px" position="absolute" w="12x" />
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
                onClick={() =>
                  module?.type === 'tracker'
                    ? handleClearFilter(selectedRoleUser)
                    : handleClearAuditFilter(selectedRoleUser)
                }
                stroke="usersSelector.roles.selectedRole.crossIcon"
                w="15px"
              />
            </Flex>
          ))}
      </Box>

      <UsersSelector
        handleChange={
          module?.type === 'tracker' ? handleUserChange : handleAuditUserChange
        }
        searchText={searchText}
        selected={selectedUsers}
        selectedRole={selectedRole}
        users={users as IUser[]}
      />
    </Box>
  );
};

export default UserFilter;
