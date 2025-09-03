import { useEffect, useState } from 'react';

import { Flex, Stack } from '@chakra-ui/react';

import { auditStatuses } from '../../hooks/useAuditUtils';
import { IAudit } from '../../interfaces/IAudit';
import AuditSquare from './AuditSquare';

function AuditsGroup({ audits }: { audits: IAudit[] }) {
  const [filteredResults, setFilteredResults] = useState<any>({});

  useEffect(() => {
    const filteredAudits: any = {};
    filteredAudits.completed = audits.filter((audit) => audit.status === 'completed');
    filteredAudits.upcoming = audits.filter((audit) => audit.status === 'upcoming');
    filteredAudits.missed = audits.filter((audit) => audit.status === 'missed');
    setFilteredResults(filteredAudits);
  }, [audits]);

  const auditsTextGroup = {
    completed: '#62c240',
    upcoming: '#FFA012',
    missed: '#FC5960',
  };

  const auditsGroupBg = {
    completed: '#C6F6D5',
    upcoming: '#FEEBCB',
    missed: '#FED7D7',
  };

  const renderGroup = (group: string) => (
    <Flex data-id="030925-c6438f" direction="column" key={group}  minW="380px" pl={3} pr={2} pt={2} w="380px">
      <Flex
        data-id="030925-184a20"
        align="center"
        bg={auditsGroupBg[group]}
        borderRadius={'md'}
        color="#FFFFFF"
        fontWeight="700"
        justifyContent={'center'}
        mb={4}
        minH="40px"
        pl={5}
        pr={4}
        textColor={auditsTextGroup[group]}
        w="full"
      >
        {auditStatuses[group]}
      </Flex>
      <Stack
        data-id="030925-b67d8f"
        align="center"
        bg={'#F7FAFC'}
        borderRadius={'md'}
        boxShadow={'sm'}
        direction="column"
        p={4}
        spacing={6}
        w="full"
      >
        {filteredResults[group]?.map((audit: IAudit) => <AuditSquare data-id="030925-6f7c4b" audit={audit} key={audit._id} />)}
      </Stack>
    </Flex>
  );

  return (
    <Flex data-id="030925-1d57f5" bg="#ffffff" h="full" overflow="auto" pt="3" w="full">
      {Object.keys(auditStatuses).map((status) => renderGroup(status))}
    </Flex>
  );
}

export default AuditsGroup;

export const auditsGroupStyles = {
  auditsGroup: {
    completed: '#62c240',
    upcoming: '#FFA012',
    missed: '#FC5960',
  },
  auditsTextGroup: {
    completed: '#62c240',
    upcoming: '#FFA012',
    missed: '#FC5960',
  },
  auditsGroupBg: {
    completed: '#C6F6D5',
    upcoming: '#FEEBCB',
    missed: '#FED7D7',
  },
};
