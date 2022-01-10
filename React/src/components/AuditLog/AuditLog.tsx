import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Flex,
  Text,
} from '@chakra-ui/react';
import { gql, useQuery } from '@apollo/client';
import { isEqual } from 'date-fns';

import Loader from '../Loader';
import AuditLogDay from './AuditLogDay';
import { IAuditLog } from '../../interfaces/IAuditLog';

const GET_AUDIT_LOGS = gql`
  query AuditLogs($auditLogsQuery: AuditLogsQuery) {
    auditLogs(auditLogsQuery: $auditLogsQuery) {
      _id
      records {
        action
        coll
        element {
          _id
          name
        }
        values
        metatags {
          addedAt
        }
      }
    }
  }
`;

const AuditLog = () => {
  const dateLimit = useMemo(() => new Date(), []);
  const { data, loading, refetch } = useQuery(GET_AUDIT_LOGS, {
    variables: {
      auditLogsQuery: {
        skip: 0,
        limit: 5,
        dateLimit,
      },
    },
  });
  const [skip, setSkip] = useState<number>(0);
  const [auditLogs, setAuditLogs] = useState<IAuditLog[]>([]);

  useEffect(() => {
    refetch({
      auditLogsQuery: {
        skip,
        limit: 5,
        dateLimit,
      },
    });
  }, [skip, dateLimit, refetch]);

  useEffect(() => {
    if (data) {
      setAuditLogs(currentLogs => {
        return data.auditLogs.reduce((acc, curr) => {
          const newAcc = [...acc];
          const currentLog = newAcc.find(({ _id }) => _id === curr._id);
          if (currentLog) {
            curr.records.forEach(record => {
              if (!currentLog.records.some(({ metatags: { addedAt } }) => isEqual(new Date(record.metatags.addedAt), new Date(addedAt)))) {
                currentLog.records.push(record);
              }
            })
          } else {
            newAcc.push({
              _id: curr._id,
              records: curr.records.map(record => ({
                action: record.action,
                coll: record.coll,
                element: record.element,
                values: record.values,
                metatags: record.metatags,
              }))
            });
          }
          return newAcc;
        }, currentLogs);
      });
    }
  }, [data]);

  return (
    <Flex flexDirection="column" rounded="md" bg="auditLog.bg" position="relative" w='100%' pt='20px'>
      <Box w="108px" h="calc(100% - 150px)" borderRight="2px dashed" borderColor="auditLog.border" position="absolute" zIndex="1" opacity="0.4" top="40px"></Box>
      {auditLogs.map(auditLog => <AuditLogDay key={auditLog._id} auditLog={auditLog} />)}
      {loading && <Box mb={4}><Loader center /></Box>}
      {!loading && (
        <Text cursor='pointer' color='auditLog.loadMore' mb={4} onClick={() => setSkip(prev => prev + 5)}>Load more audit logs</Text>
      )}
    </Flex>
  );
};

export const auditLogStyles = {
  auditLog: {
    bg: '#FFFFFF',
    border: '#424B50',
    loadMore: '#000000'
  }
};

export default AuditLog;
