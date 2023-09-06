import React, { useCallback } from 'react';

import { Flex } from '@chakra-ui/react';
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
    (<Flex data-id="32e75f6fb74c" direction={['column', 'row']} mb="20px">
      <Flex
        bg="auditLogDayStyles.dateBg"
        borderRadius="8px"
        color="auditLogDayStyles.dateColor"
        data-id="6ad363594c2b"
        fontSize="14px"
        fontWeight="bold"
        h="fit-content"
        p="6px 13px"
        w="108px">
        {daysAgo(auditLog._id)}
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
    dateColor: '#282F36',
  },
};

export default AuditLogDay;
