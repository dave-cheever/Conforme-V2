import { Flex } from '@chakra-ui/react';

import { IAuditLog } from '../../interfaces/IAuditLog';
import Loader from '../Loader';
import AuditLogDay from './AuditLogDay';

interface IProps {
  auditLogs: IAuditLog[] | [];
  loading: boolean;
}

const AuditLog = ({ auditLogs, loading }: IProps) => {
  if (loading) {
    return (
      <Flex h="calc(100vh - 150px)" w="full">
        <Loader center />
      </Flex>
    );
  }

  return (
    <Flex
      bg="auditLog.bg"
      flexDirection="column"
      position="relative"
      pt="20px"
      rounded="md"
      w="100%"
    >
      {auditLogs.map((auditLog) => (
        <AuditLogDay auditLog={auditLog} key={auditLog._id} />
      ))}
    </Flex>
  );
};

export const auditLogStyles = {
  auditLog: {
    bg: '#FFFFFF',
    border: '#424B50',
    loadMore: '#000000',
  },
};

export default AuditLog;
