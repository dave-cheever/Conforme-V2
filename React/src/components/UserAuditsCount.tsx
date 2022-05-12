import { Flex } from '@chakra-ui/react';

import { useFiltersContext } from '../contexts/FiltersProvider';
import useNavigate from '../hooks/useNavigate';
import { IAuditFilters } from '../interfaces/IFilters';

const UserAuditsCount = ({
  status,
  auditsCount,
  userId,
}: {
  status?: string;
  auditsCount?: number;
  userId: string;
}) => {
  const { filtersValues, setFilters } = useFiltersContext();
  const { navigateTo } = useNavigate();

  const handleFilter = ({ status, userId }) => {
    const statusFilter = (filtersValues as IAuditFilters).status?.value;
    const userFilter = (filtersValues as IAuditFilters).usersIds?.value;

    setFilters({
      usersIds: {
        ...userFilter,
        auditorIds: [userId],
      },
      status: [...(statusFilter ?? []), status],
    });
  };

  const handleClick = () => {
    localStorage.setItem('viewMode', 'grid');
    navigateTo('/');
    handleFilter({ status, userId });
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
      {auditsCount || 0}
    </Flex>
  );
};

export default UserAuditsCount;
