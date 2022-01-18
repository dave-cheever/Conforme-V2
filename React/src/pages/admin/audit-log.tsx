import React, { useEffect, useMemo, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";
import { isEqual } from "date-fns";

import Header from "../../components/Header";
import AuditLogComponent from "../../components/AuditLog/AuditLog";
import { IAuditLog } from "../../interfaces/IAuditLog";
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
  const dateLimit = useMemo(() => new Date(), []);
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
      },
    },
  });
  const [skip, setSkip] = useState<number>(0);
  const [auditLogs, setAuditLogs] = useState<IAuditLog[]>([]);

  useEffect(() => {
    refetch({
      auditLogsQuery: {
        skip,
        limit: auditLogLimit,
        dateLimit,
      },
    });
  }, [skip, dateLimit, refetch, auditLogLimit]);

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

  return (
    <>
      <Header breadcrumbs={["Admin", "Audit log"]} />
      <Box p="30px" pt="0px" h="calc(100vh - 150px)" overflow="auto">
        <Flex px="6" bg="white" pt="3" borderRadius="20px" flexDir="column" h="fit-content">
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
      </Box>
    </>
  );
};

export default AuditLog;
