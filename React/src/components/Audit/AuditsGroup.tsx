import { useEffect, useState } from 'react';

import { Flex, Stack } from '@chakra-ui/react';

import useAuditUtils, { auditStatuses } from '../../hooks/useAuditUtils';
import { IAudit } from '../../interfaces/IAudit';
import AuditSquare from './AuditSquare';

const AuditsGroup = ({ audits }: { audits: IAudit[] }) => {
  const [filteredResults, setFilteredResults] = useState<any>({});
  const { getStatus } = useAuditUtils();

  useEffect(() => {
    const filteredAudits: any = {};
    filteredAudits.completed = audits.filter(
      (audit) => getStatus(audit) === 'completed',
    );
    filteredAudits.inProgress = audits.filter(
      (audit) => getStatus(audit) === 'inProgress',
    );
    filteredAudits.overdue = audits.filter(
      (audit) => getStatus(audit) === 'overdue',
    );
    setFilteredResults(filteredAudits);
  }, [audits]);

  const renderGroup = (group: string) => (
    <Flex
      direction="column"
      key={group}
      minW="calc(347px + 1rem)"
      pl={8}
      pr={3}
      pt={2}
    >
      <Flex
        align="center"
        bg={`auditsGroup.${group}`}
        color="#FFFFFF"
        fontWeight="700"
        justify="space-between"
        mb={4}
        minH="40px"
        pl={5}
        pr={4}
        rounded="full"
        w="full"
      >
        {auditStatuses[group]}
      </Flex>
      <Stack align="center" direction="column" pb={5} spacing={6} w="full">
        {filteredResults[group]
          ?.sort((a, b) => {
            if (a.dueDate === null) return 1;

            if (b.dueDate === null) return -1;

            return a.dueDate && b.dueDate
              ? a.dueDate.toString().localeCompare(b.dueDate.toString())
              : 0;
          })
          ?.map((audit: IAudit) => (
            <AuditSquare audit={audit} key={audit._id} />
          ))}
      </Stack>
    </Flex>
  );

  return (
    <Flex h="full" overflow="auto" pt="3" w="full">
      {Object.keys(auditStatuses)
        .filter((status) => status !== 'comingUp')
        .map((status) => renderGroup(status))}
    </Flex>
  );
};

export default AuditsGroup;

export const auditsGroupStyles = {
  auditsGroup: {
    completed: '#62c240',
    inProgress: '#FFA012',
    overdue: '#FC5960',
  },
};
