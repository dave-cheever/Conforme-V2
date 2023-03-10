import { Flex } from '@chakra-ui/react';

import { useFiltersContext } from '../contexts/FiltersProvider';
import useNavigate from '../hooks/useNavigate';

const UserResponseCount = ({ userId, role, responseCount }) => {
  const { setFilters, setResponseFiltersValue } = useFiltersContext();
  const { navigateTo } = useNavigate();

  const handleClick = () => {
    navigateTo('/');
    switch (role) {
      case 'responsible':
        setResponseFiltersValue({
          usersIds: {
            value: {
              responsibleIds: [userId],
            },
          },
        });
        break;
      case 'accountable':
        setFilters({
          usersIds: {
            accountableIds: [userId],
          },
        });
        break;
      case 'contributor':
        setFilters({
          usersIds: {
            contributorIds: [userId],
          },
        });
        break;
      case 'follower':
        setFilters({
          usersIds: {
            followerIds: [userId],
          },
        });
        break;
      default:
        break;
    }
  };

  return (
    (<Flex
      alignItems="center"
      bg="userItem.responseCountBg"
      cursor="pointer"
      data-id="145b0f7e0833"
      h="calc(100% - 1px)"
      justifyContent="center"
      mr="1px"
      mt="1px"
      onClick={handleClick}
      w="calc(25% - 1px)">
      {responseCount || 0}
    </Flex>)
  );
};

export default UserResponseCount;
