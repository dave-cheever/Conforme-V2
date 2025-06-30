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
      (<Flex data-id="92b99b55ebbf" h="calc(100vh - 150px)" w="full">
        <Loader center data-id="a1754f1ed60a" />
      </Flex>)
    );
  }

  return (<>
    <Flex
      bg="auditLog.bg"
      data-id="4851d1175a41"
      flexDirection="column"
      position="relative"
      pt={["0px", "20px"]}
      rounded="md"
      w="100%">
      {auditLogs.map((auditLog, index) => (
        <AuditLogDay auditLog={auditLog} data-id="b8998a79f75c" key={index} />
      ))}
    </Flex>
    {isLoadingMore && <Loader center data-id="fffffe97dc26" size="md" />}
  </>);
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
