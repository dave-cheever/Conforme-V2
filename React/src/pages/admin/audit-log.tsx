import React, { useEffect, useMemo, useState } from 'react';

import { gql, useQuery } from '@apollo/client';
import { Box, Flex, Text } from '@chakra-ui/react';
import { isEqual } from 'date-fns';

import AuditLogComponent from '../../components/AuditLog/AuditLog';
import Header from '../../components/Header';
import { useAppContext } from '../../contexts/AppProvider';
import { IAuditLog } from '../../interfaces/IAuditLog';

const GET_AUDIT_LOGS = gql`
  query AuditLogs($auditLogsQuery: AuditLogsQuery) {
    auditLog(auditLogsQuery: $auditLogsQuery) {
      _id
      totalAuditLogs
      auditLogs {
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
            addedBy
          }
        }
      }
    }
  }
`;

const AuditLog = () => {
  const dateLimit = useMemo(() => new Date(), []);
  const { settings } = useAppContext();
  const auditLogLimit = useMemo(() => {
    if (settings.length === 0) return 5;

    if (settings?.filter((settings) => settings.name === 'auditLogLimit').length === 0) return 5;

    if (settings?.filter((settings) => settings.name === 'auditLogLimit')[0]?.value)
      return Number(settings?.filter((settings) => settings.name === 'auditLogLimit')[0]?.value);

    return 5;
  }, [settings]);

  const { data, loading, refetch } = useQuery(GET_AUDIT_LOGS, {
    variables: {
      auditLogsQuery: {
        skip: 0,
        limit: auditLogLimit,
        dateLimit,
        actions: ['add', 'update', 'delete'],
      },
    },
  });
  const [skip, setSkip] = useState<number>(0);
  const [auditLogs, setAuditLogs] = useState<IAuditLog[]>([]);
  const [totalAuditLogs, setTotalAuditLogs] = useState<Number>(0);
  const [countAuditLogs, setCountAuditLogs] = useState<number>(0);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  useEffect(() => {
    refetch({
      auditLogsQuery: {
        skip,
        limit: auditLogLimit,
        dateLimit,
        actions: ['add', 'update', 'delete'],
      },
    });
  }, [skip, dateLimit, refetch, auditLogLimit]);

  useEffect(() => {
    if (data) {
      setAuditLogs((currentLogs) =>
        data.auditLog.auditLogs.reduce((acc, curr) => {
          const newAcc = [...acc];
          const currentLog = newAcc.find(({ _id }) => _id === curr._id);
          if (currentLog) {
            curr.records.forEach((record) => {
              if (!currentLog.records.some(({ metatags: { addedAt } }) => isEqual(new Date(record.metatags.addedAt), new Date(addedAt)))) {
                setCountAuditLogs((prevValue) => prevValue + 1);
                currentLog.records.push(record);
              }
            });
            setIsLoadingMore(false);
          } else {
            newAcc.push({
              _id: curr._id,
              records: curr.records.map((record, index) => {
                setCountAuditLogs(index + 1);
                return {
                  action: record.action,
                  coll: record.coll,
                  element: record.element,
                  values: record.values,
                  metatags: record.metatags,
                };
              }),
            });
            setIsLoadingMore(false);
          }
          return newAcc;
        }, currentLogs),
      );
      setTotalAuditLogs(data?.auditLog?.totalAuditLogs > 0 ? data?.auditLog?.totalAuditLogs : 0);
    }
  }, [data]);

  return (<>
    <Header breadcrumbs={['Admin', 'Audit log']} data-id="87fb4abfbc7b" />
    <Box
      data-id="949e7c1a34f6"
      h="calc(100vh - 150px)"
      overflow="auto"
      p="30px"
      pt="0px">
      <Flex
        bg="white"
        borderRadius="20px"
        data-id="9a47c738995d"
        flexDir="column"
        h="fit-content"
        pt="3"
        px="6">
        <AuditLogComponent
          auditLogs={auditLogs}
          data-id="5d8d380bfb32"
          isLoadingMore={isLoadingMore}
          loading={loading} />
        {!loading &&
          (totalAuditLogs === countAuditLogs ? (
            <Text color="auditLog.noLogs" data-id="cf92fd32fd58" mb={4}>
              No more logs
            </Text>
          ) : (
            <Text
              color="auditLog.loadMore"
              cursor="pointer"
              data-id="9f20c49862bb"
              mb={4}
              onClick={() => {
                setSkip((prev) => prev + 5);
                setIsLoadingMore(true);
              }}>
              Load more audit logs
            </Text>
          ))}
      </Flex>
    </Box>
  </>);
};

export default AuditLog;
