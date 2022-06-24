import { useEffect, useState } from 'react';

import { Flex, Stack } from '@chakra-ui/react';

import { auditStatuses } from '../../hooks/useAuditUtils';
import { IAudit } from '../../interfaces/IAudit';
import AuditSquare from './AuditSquare';

const AuditsGroup = ({ audits }: { audits: IAudit[] }) => {
  const [filteredResults, setFilteredResults] = useState<any>({});

  useEffect(() => {
    const filteredAudits: any = {};
    filteredAudits.upcoming = audits.filter((audit) => audit.status === 'upcoming');
    filteredAudits.completed = audits.filter((audit) => audit.status === 'completed');
    filteredAudits.missed = audits.filter((audit) => audit.status === 'missed');
    setFilteredResults(filteredAudits);
  }, [audits]);

  const renderGroup = (group: string) => (
    <Flex direction="column" key={group} minW="calc(347px + 1rem)" pl={8} pr={3} pt={2}>
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
        {filteredResults[group]?.map((audit: IAudit) => (
          <AuditSquare audit={audit} key={audit._id} />
        ))}
      </Stack>
    </Flex>
  );

  return (
    <Flex h="full" overflow="auto" pt="3" w="full">
      {Object.keys(auditStatuses).map((status) => renderGroup(status))}
    </Flex>
  );
};

export default AuditsGroup;

export const auditsGroupStyles = {
  auditsGroup: {
    completed: '#62c240',
    upcoming: '#FFA012',
    missed: '#FC5960',
  },
};
