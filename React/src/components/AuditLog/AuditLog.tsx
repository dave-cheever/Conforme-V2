import { Flex } from '@chakra-ui/react';

import { IAuditLog } from '../../interfaces/IAuditLog';
import Loader from '../Loader';
import AuditLogDay from './AuditLogDay';

interface IProps {
  auditLogs: IAuditLog[] | [];
  loading: boolean;
  isLoadingMore: boolean;
}

const AuditLog = ({ auditLogs, loading, isLoadingMore }: IProps) => {
  if (loading) {
    return (
      <Flex h="calc(100vh - 150px)" w="full">
        <Loader center />
      </Flex>
    );
  }

  return (
    <>
      <Flex bg="auditLog.bg" flexDirection="column" position="relative" pt="20px" rounded="md" w="100%">
        {auditLogs.map((auditLog, index) => (
          <AuditLogDay auditLog={auditLog} key={index} />
        ))}
      </Flex>
      {isLoadingMore && <Loader center size="md" />}
    </>
  );
};

export const auditLogStyles = {
  auditLog: {
    bg: '#FFFFFF',
    border: '#424B50',
    loadMore: '#000000',
    noLogs: '#818197',
  },
};

export default AuditLog;
