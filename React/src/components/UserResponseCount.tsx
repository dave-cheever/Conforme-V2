import React from 'react';
import { useHistory } from 'react-router-dom';

import { Flex } from '@chakra-ui/react';

import { useFiltersContext } from '../contexts/FiltersProvider';

const UserResponseCount = ({ userId, role, responseCount }) => {
  const { filtersValues, setFilters } = useFiltersContext();
  const history = useHistory();

  const handleUserChange = ({ userRole, value }) => {
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

  const handleClick = () => {
    localStorage.setItem('viewMode', 'Grid');
    history.push('/');
    handleUserChange({ userRole: role, value: [userId] });
  };

  return (
    <Flex
      alignItems="center"
      bg="userItem.responseCountBg"
      cursor="pointer"
      h="calc(100% - 1px)"
      justifyContent="center"
      mr="1px"
      mt="1px"
      onClick={handleClick}
      w="calc(25% - 1px)"
    >
      {responseCount || 0}
    </Flex>
  );
};

export default UserResponseCount;
