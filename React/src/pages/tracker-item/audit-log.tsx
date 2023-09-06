import React, { useEffect, useMemo, useState } from 'react';

import { gql, useQuery } from '@apollo/client';
import { Flex, Text } from '@chakra-ui/react';
import { isEqual } from 'date-fns';

import { auditTabs } from '../../bootstrap/config';
import AuditLogComponent from '../../components/AuditLog/AuditLog';
import TabItem from '../../components/Settings/TabItem';
import { useAppContext } from '../../contexts/AppProvider';
import { useResponseContext } from '../../contexts/ResponseProvider';
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
  const [dateLimit, setDateLimit] = useState(new Date());
  const { response } = useResponseContext();
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
        elementId: response?._id,
        fields: [] as string[],
      },
    },
    fetchPolicy: 'network-only',
  });
  const [skip, setSkip] = useState<number>(0);
  const [activeTab, setActiveTab] = useState(0);
  const [fieldsFilter, setFieldsFilter] = useState<string[]>([]);
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
        elementId: response?._id,
        fields: fieldsFilter,
      },
    });
  }, [skip, dateLimit, fieldsFilter, refetch, response, auditLogLimit]);

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
      setTotalAuditLogs(data.auditLog.totalAuditLogs > 0 ? data.auditLog.totalAuditLogs : 0);
      return;
    }
    setCountAuditLogs(0);
  }, [data]);

  useEffect(() => {
    setDateLimit(new Date());
    setSkip(0);
    setAuditLogs([]);
    switch (activeTab) {
      case 0:
        setFieldsFilter([]);
        break;

      case 1:
        setFieldsFilter(['lastCompletionDate']);
        break;

      case 2:
        setFieldsFilter(['responsibleId', 'accountableId', 'contributorsIds', 'followersIds']);
        break;
      default:
        break;
    }
  }, [activeTab]);

  return (
    (<Flex
      bg="white"
      borderRadius="20px"
      data-id="1695b75757c3"
      flexDir="column"
      h="full"
      overflow="auto"
      p="25px 30px"
      w="full">
      <Flex data-id="19a227057187" mb="3">
        {auditTabs?.map(({ index, label }) => (
          <TabItem
            active={index === activeTab}
            data-id="e8606fb8b7d1"
            index={index}
            key={index}
            label={label}
            setActiveTab={setActiveTab} />
        ))}
      </Flex>
      <AuditLogComponent
        auditLogs={auditLogs}
        data-id="2b623ff1c332"
        isLoadingMore={isLoadingMore}
        loading={loading} />
      {!loading &&
        (totalAuditLogs === countAuditLogs ? (
          <Text color="auditLog.noLogs" data-id="a3b166660640" mb={4}>
            No more logs
          </Text>
        ) : (
          <Text
            color="auditLog.loadMore"
            cursor="pointer"
            data-id="fb8ca990d8ac"
            mb={4}
            onClick={() => {
              setSkip((prev) => prev + 5);
              setIsLoadingMore(true);
            }}>
            Load more audit logs
          </Text>
        ))}
    </Flex>)
  );
}

export default AuditLog;
