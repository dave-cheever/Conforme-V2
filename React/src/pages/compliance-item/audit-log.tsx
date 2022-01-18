import React, { useEffect, useMemo, useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";
import { isEqual } from "date-fns";

import AuditLogComponent from "../../components/AuditLog/AuditLog";
import { IAuditLog } from "../../interfaces/IAuditLog";
import { useResponseContext } from "../../contexts/ResponseProvider";
import { auditTabs } from "../../bootstrap/config";
import TabItem from "../../components/Settings/TabItem";
import { useAppContext } from "../../contexts/AppProvider";

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
          addedBy
        }
      }
    }
  }
`;

const AuditLog = () => {
  const [dateLimit, setDateLimit] = useState(new Date());
  const { response } = useResponseContext();
  const { settings } = useAppContext();

  const auditLogLimit = useMemo(() => {  
    if(settings.length === 0){
      return 5;
    }
    if(settings?.filter(settings => settings.name === "auditLogLimit").length === 0){
      return 5;
    }

    if(settings?.filter(settings => settings.name === "auditLogLimit")[0]?.value){
      return Number(settings?.filter(settings => settings.name === "auditLogLimit")[0]?.value);
    }

    return 5;
  },[settings]);

  const { data, loading, refetch } = useQuery(GET_AUDIT_LOGS, {
    variables: {
      auditLogsQuery: {
        skip: 0,
        limit: auditLogLimit,
        dateLimit,
        elementId: response._id,
        fields: [] as string[],
      },
    },
  });
  const [skip, setSkip] = useState<number>(0);
  const [activeTab, setActiveTab] = useState(0);
  const [fieldsFilter, setFieldsFilter] = useState<string[]>([]);
  const [auditLogs, setAuditLogs] = useState<IAuditLog[]>([]);

  useEffect(() => {
    refetch({
      auditLogsQuery: {
        skip,
        limit: auditLogLimit,
        dateLimit,
        elementId: response._id,
        fields: fieldsFilter,
      },
    });
  }, [skip, dateLimit, fieldsFilter, refetch, response, auditLogLimit]);

  useEffect(() => {
    if (data) {
      setAuditLogs((currentLogs) => {
        return data.auditLogs.reduce((acc, curr) => {
          const newAcc = [...acc];
          const currentLog = newAcc.find(({ _id }) => _id === curr._id);
          if (currentLog) {
            curr.records.forEach((record) => {
              if (
                !currentLog.records.some(({ metatags: { addedAt } }) =>
                  isEqual(new Date(record.metatags.addedAt), new Date(addedAt))
                )
              ) {
                currentLog.records.push(record);
              }
            });
          } else {
            newAcc.push({
              _id: curr._id,
              records: curr.records.map((record) => ({
                action: record.action,
                coll: record.coll,
                element: record.element,
                values: record.values,
                metatags: record.metatags,
              })),
            });
          }
          return newAcc;
        }, currentLogs);
      });
    }
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
        setFieldsFilter(['lastRenewalDate']);
        break;
        
      case 2:
        setFieldsFilter(['responsibleId', 'accountableId', 'contributorsIds', 'followersIds']);
        break;
    }
  }, [activeTab]);

  return (
    <Flex
      w="full"
      h="full"
      bg="white"
      borderRadius="20px"
      p="25px 30px"
      overflow="auto"
      flexDir="column"
    >
      <Flex mb="3">
        {auditTabs?.map(({ index, label }) => (
          <TabItem
            key={index}
            setActiveTab={setActiveTab}
            index={index}
            active={index === activeTab}
            label={label}
          />
        )
        )}
      </Flex>
      <AuditLogComponent auditLogs={auditLogs} loading={loading} />
      {!loading && (
        <Text
          cursor="pointer"
          color="auditLog.loadMore"
          mb={4}
          onClick={() => setSkip((prev) => prev + 5)}
        >
          Load more audit logs
        </Text>
      )}
    </Flex>
  );
};

export default AuditLog;
