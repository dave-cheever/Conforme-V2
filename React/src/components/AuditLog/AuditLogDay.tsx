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
    (<Flex data-id="32e75f6fb74c" direction="column" mb="20px">
      <Flex alignItems="center" data-id="d1c2f8b3e225" direction="row" justifyContent="space-between">
        <Flex
        borderRadius="8px"
        color="auditLogDayStyles.dateColor"
        data-id="6ad363594c2b"
        fontSize="16px"
        fontWeight="500"
        h="fit-content"
        p="6px 13px"
        w="108px">
        {daysAgo(auditLog._id)} 
        </Flex>

        <Box borderBottom="1px solid #E2E8F0" data-id="c9f7e4d1b7a5" display={["none", "block"]} height={"1px"} w="full" />
      </Flex>
    
      <Flex data-id="c50bfda03776" flexDir="column" mt="2" w="full">
        {auditLog.records.map((audit) => (
          <AuditLogRecord
            audit={audit}
            data-id="a2d0187186d4"
            key={audit.metatags?.addedAt?.toString()} />
        ))}
      </Flex>
    </Flex>)
  );
}

export const auditLogDayStyles = {
  auditLogDayStyles: {
    dateBg: '#F0F2F5',
    dateColor: '#4A5568',
  },
};

export default AuditLogDay;
