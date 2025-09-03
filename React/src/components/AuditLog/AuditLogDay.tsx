import React, { useCallback } from 'react';

import { Box, Flex } from '@chakra-ui/react';
import moment from 'moment';

import { IAuditLog } from '../../interfaces/IAuditLog';
import AuditLogRecord from './AuditLogRecord';

function AuditLogDay({ auditLog }: { auditLog: IAuditLog }) {
  const daysAgo = useCallback((day) => {
    const today = moment(new Date().toISOString().split('T')[0]);
    let value = '';
    const dayAgo = moment(day);

    switch (today.diff(dayAgo, 'days').toString()) {
      case '-1':
      case '0':
        value = 'Today';
        break;
      case '1':
        value = 'Yesterday';
        break;
      default:
        value = `${today.diff(dayAgo, 'days').toString()} days ago`;
    }
    return value;
  }, []);

  if (auditLog.records.length === 0) return null;

  return (
    <Flex data-id="030925-a61092" direction="column" mb="20px">
      <Flex data-id="030925-8a0a19" alignItems="center" direction="row" justifyContent="space-between">
        <Flex
        data-id="030925-a0aa08"
        borderRadius="8px"
        color="auditLogDayStyles.dateColor"
        fontSize="16px"
        fontWeight="500"
        h="fit-content"
        p="6px 13px"
        w="180px">
        {daysAgo(auditLog._id)} 
        </Flex>

        <Box data-id="030925-5c4f65" borderBottom="1px solid #CBD5E0" display={["none", "block"]} height={"1px"} w="full" />
      </Flex>
      <Flex data-id="030925-a0889c" flexDir="column" mt="2" w="full">
        {auditLog.records.map((audit) => (
          <AuditLogRecord
            data-id="030925-d2d3e4"
            audit={audit}
            key={audit.metatags?.addedAt?.toString()} />
        ))}
      </Flex>
    </Flex>
  );
}

export const auditLogDayStyles = {
  auditLogDayStyles: {
    dateBg: '#F0F2F5',
    dateColor: '#4A5568',
  },
};

export default AuditLogDay;
