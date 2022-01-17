import { Flex } from "@chakra-ui/react";

import Loader from "../Loader";
import AuditLogDay from "./AuditLogDay";
import { IAuditLog } from "../../interfaces/IAuditLog";

interface IProps {
  auditLogs: IAuditLog[] | [];
  loading: boolean;
}

const AuditLog = ({ auditLogs, loading }: IProps) => {
  if (loading) {
    return (
      <Flex w="full" h="calc(100vh - 150px)">
        <Loader center />
      </Flex>
    );
  }

  return (
    <Flex
      flexDirection="column"
      rounded="md"
      bg="auditLog.bg"
      position="relative"
      w="100%"
      pt="20px"
    >
      {auditLogs.map((auditLog) => (
        <AuditLogDay key={auditLog._id} auditLog={auditLog} />
      ))}
    </Flex>
  );
};

export const auditLogStyles = {
  auditLog: {
    bg: "#FFFFFF",
    border: "#424B50",
    loadMore: "#000000",
  },
};

export default AuditLog;
