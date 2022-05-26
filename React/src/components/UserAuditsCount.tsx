import { Flex } from '@chakra-ui/react';

import { useFiltersContext } from '../contexts/FiltersProvider';
import useNavigate from '../hooks/useNavigate';

const UserAuditsCount = ({ status, auditsCount, userId }: { status?: string; auditsCount?: number; userId: string }) => {
  const { setAuditFiltersValue } = useFiltersContext();
  const { navigateTo } = useNavigate();

  const handleClick = () => {
    navigateTo('/');
    setAuditFiltersValue({
      usersIds: {
        value: {
          auditorsIds: [userId],
        },
      },
      status: {
        value: status ? [status] : null,
      },
    });
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
