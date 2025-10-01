import React, { useEffect, useMemo, useState } from 'react';

import { gql, useQuery } from '@apollo/client';
import { Box, Flex, Text } from '@chakra-ui/react';
import moment from 'moment';

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

function AuditLog() {
  const dateLimit = useMemo(() => new Date(), []);
  const { settings, module, organizationConfig } = useAppContext();
  const auditLogLimit = useMemo(() => {
    if (settings.length === 0) return 5;

    if (settings?.filter((settings) => settings.name === 'auditLogLimit').length === 0) return 5;

    if (settings?.filter((settings) => settings.name === 'auditLogLimit')[0]?.value)
      return Number(settings?.filter((settings) => settings.name === 'auditLogLimit')[0]?.value);

    return 5;
  }, [settings]);

  const getColl = () => {
    if (module?.type === 'tracker') return 'trackerItems';
    if (module?.type === 'audits') return 'audits';
    return undefined;
  };

  const { data, loading, refetch } = useQuery(GET_AUDIT_LOGS, {
    variables: {
      auditLogsQuery: {
        skip: 0,
        limit: auditLogLimit,
        dateLimit,
        actions: ['add', 'update', 'delete'],
        organizationId: organizationConfig?._id,
        coll: getColl(),
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
        organizationId: organizationConfig?._id,
        coll: getColl(),
      },
    });
  }, [skip, dateLimit, refetch, auditLogLimit]);

useEffect(() => {
  if (data) {
    console.log("Fetched raw data", data);
    const groupedByDay: Record<string, IAuditLog> = {};

    data.auditLog.auditLogs.forEach((group) => {
      group.records.forEach((record) => {
        const dateKey = moment(record.metatags.addedAt).format('YYYY-MM-DD');
        if (!groupedByDay[dateKey]) {
          groupedByDay[dateKey] = {
            _id: dateKey,
            totalAuditLogs: 0,
            records: [],
          };
        }

        // Prevent duplicates
        const alreadyExists = groupedByDay[dateKey].records.some(
          (r) => r.metatags?.addedAt === record.metatags.addedAt,
        );

        if (!alreadyExists) {
          groupedByDay[dateKey].records.push(record);
          setCountAuditLogs((prev) => prev + 1);
        }
      });
    });

    // Convert object to array and sort by date (latest first)
    const sortedAuditLogs = Object.values(groupedByDay).sort((a, b) =>
      moment(b._id).diff(moment(a._id)),
    );

    setAuditLogs((prev) => {
      const merged = [...prev];
      sortedAuditLogs.forEach((newLog) => {
        const existing = merged.find((p) => p._id === newLog._id);
        if (existing) {
          newLog.records.forEach((r) => {
            if (!existing.records.some((e) => e.metatags?.addedAt === r.metatags?.addedAt)) 
              existing.records.push(r);
            
          });
        } else 
          merged.push(newLog);
        
      });
      return merged;
    });

    setTotalAuditLogs(data?.auditLog?.totalAuditLogs || 0);
    setIsLoadingMore(false);
  }
}, [data]);

  return (
    <>
      <Header breadcrumbs={['Admin', 'Audit log']} data-id="000305" />
      <Box
        data-id="000306"
        h="calc(100vh - 150px)"
        overflow="auto"
        p={["10px", "30px"]}
        pt="0px">
        <Flex
          bg="white"
          borderRadius="20px"
          data-id="000307"
          flexDir="column"
          h="fit-content"
          pt="3"
          px="6">
          <AuditLogComponent
            auditLogs={auditLogs}
            data-id="000308"
            isLoadingMore={isLoadingMore}
            loading={loading} />
          {!loading &&
            (totalAuditLogs === countAuditLogs ? (
              <Text color="auditLog.noLogs" data-id="000309" mb={4}>
                No more logs
              </Text>
            ) : (
              <Text
                color="auditLog.loadMore"
                cursor="pointer"
                data-id="000310"
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
    </>
  );
}

export default AuditLog;
