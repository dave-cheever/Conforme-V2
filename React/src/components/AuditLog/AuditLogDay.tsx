import React, { useCallback } from "react";
import { Flex } from "@chakra-ui/react";
import moment from "moment";

import { IAuditLog } from "../../interfaces/IAuditLog";
import AuditLogRecord from "./AuditLogRecord";

const AuditLogDay = ({ auditLog }: { auditLog: IAuditLog }) => {
  const daysAgo = useCallback((day) => {
    const today = moment(new Date().toISOString().split("T")[0]);
    let value = "";
    const dayAgo = moment(day);

    switch (today.diff(dayAgo, "days").toString()) {
      case "0":
        value = "Today";
        break;
      case "1":
        value = "Yesterday";
        break;
      default:
        value = `${today.diff(dayAgo, "days").toString()} days ago`;
    }
    return value;
  }, []);

  if(auditLog.records.length === 0){
    return null;
  }

  return (
    <Flex zIndex="2" mb="20px">
      <Flex
        w="108px"
        h="fit-content"
        borderRadius="8px"
        color="auditLogDayStyles.dateColor"
        bg="auditLogDayStyles.dateBg"
        p="6px 13px"
        fontSize="14px"
        fontWeight="bold"
      >
        {daysAgo(auditLog._id)}
      </Flex>
      <Flex flexDir="column" w="full" mt="2">
        {auditLog.records.map((audit) => (
          <AuditLogRecord
            key={audit.metatags?.addedAt?.toString()}
            audit={audit}
          />
        ))}
      </Flex>
    </Flex>
  );
};

export const auditLogDayStyles = {
  auditLogDayStyles: {
    dateBg: "#F0F2F5",
    dateColor: "#282F36",
  },
};

export default AuditLogDay;
