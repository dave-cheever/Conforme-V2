import { Flex } from '@chakra-ui/react';

import { IAuditLog } from '../../interfaces/IAuditLog';
import Loader from '../Loader';
import AuditLogDay from './AuditLogDay';

interface IProps {
  auditLogs: IAuditLog[] | [];
  loading: boolean;
  isLoadingMore: boolean;
}

function AuditLog({ auditLogs, loading, isLoadingMore }: IProps) {
  if (loading) {
    return (
      <Flex data-id="000340" h="calc(100vh - 150px)" w="full">
        <Loader data-id="000341" center />
      </Flex>
    );
  }

  return (
    <>
      <Flex
        data-id="000342"
        bg="auditLog.bg"
        flexDirection="column"
        position="relative"
        pt={["0px", "20px"]}
        rounded="md"
        w="100%">
        {auditLogs.map((auditLog, index) => (
          <AuditLogDay data-id="000343" auditLog={auditLog} key={index} />
        ))}
      </Flex>
      {isLoadingMore && <Loader data-id="000344" center size="md" />}
    </>
  );
}

export const auditLogStyles = {
  auditLog: {
    bg: '#FFFFFF',
    border: '#424B50',
    loadMore: '#000000',
    noLogs: '#818197',
  },
};

export default AuditLog;
