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
      <Flex data-id="030925-74701e" h="calc(100vh - 150px)" w="full">
        <Loader center data-id="030925-8d6472" />
      </Flex>
    );
  }

  return (
    <>
      <Flex
        bg="auditLog.bg"
        data-id="030925-271f5c"
        flexDirection="column"
        position="relative"
        pt={["0px", "20px"]}
        rounded="md"
        w="100%">
        {auditLogs.map((auditLog, index) => (
          <AuditLogDay auditLog={auditLog} data-id="030925-682622" key={index} />
        ))}
      </Flex>
      {isLoadingMore && <Loader center data-id="030925-a22616" size="md" />}
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
