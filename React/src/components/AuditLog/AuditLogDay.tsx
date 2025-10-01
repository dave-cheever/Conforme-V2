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
    <Flex data-id="000334" direction="column" mb="20px">
      <Flex alignItems="center" data-id="000335" direction="row" justifyContent="space-between">
        <Flex
        borderRadius="8px"
        color="auditLogDayStyles.dateColor"
        data-id="000336"
        fontSize="16px"
        fontWeight="500"
        h="fit-content"
        p="6px 13px"
        w="180px">
        {daysAgo(auditLog._id)} 
        </Flex>

        <Box borderBottom="1px solid #CBD5E0" data-id="000337" display={["none", "block"]} height={"1px"} w="full" />
      </Flex>
      <Flex data-id="000338" flexDir="column" mt="2" w="full">
        {auditLog.records.map((audit) => (
          <AuditLogRecord
            audit={audit}
            data-id="000339"
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
