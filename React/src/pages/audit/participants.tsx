import { useEffect } from 'react';

import { Flex, Stack, Text, useToast } from '@chakra-ui/react';

import { toastSuccess } from '../../bootstrap/config';
import { isPermitted } from '../../components/can';
import MultipleParticipantsSelector from '../../components/Participants/MultipleParticipantsSelector';
import SingleParticipantSelector from '../../components/Participants/SingleParticipantSelector';
import { useAppContext } from '../../contexts/AppProvider';
import { useAuditContext } from '../../contexts/AuditProvider';
import ParticipantsModalProvider, { useParticipantsModalContext } from '../../contexts/ParticipantsModalProvider';

function AuditParticipants() {
  const toast = useToast();
  const { user } = useAppContext();
  const { audit, updateAudit, refetch } = useAuditContext();
  const isUserPermittedToModify = isPermitted({ user, action: 'audits.edit', data: { audit } });
  const { setSelectedParticipants } = useParticipantsModalContext();

  useEffect(() => {
    setSelectedParticipants(audit.participants ?? []);
  }, [JSON.stringify(audit)]);

  const selectAuditor = async (auditorId: string) => {
    await updateAudit({
      variables: {
        audit: {
          _id: audit._id,
          auditorId,
        },
      },
    });
    toast({ ...toastSuccess, description: 'Auditor updated' });
    refetch();
  };

  const selectParticipants = async (participantsIds: string[]) => {
    await updateAudit({
      variables: {
        audit: {
          _id: audit._id,
          participantsIds,
        },
      },
    });
    toast({ ...toastSuccess, description: 'Participants updated' });
    refetch();
  };

  return (<Stack data-id="9df24db2eae2" h={['fit-content', 'full']} spacing={4} w="full">
      <Flex data-id="e462380d55a2" justifyContent={['space-between', 'initial']}>
        <Text data-id="12d25ce06e4d" fontSize="xxl" fontWeight="semibold">
          Participants
        </Text>
      </Flex>
      <Stack
        bg="auditParticipants.bg"
        borderRadius="20px"
        data-id="7db4ae35fbc8"
        h="full"
        overflow="auto"
        px={6}
        py={4}
        rounded="20px"
        spacing={12}
        w="full">
        <SingleParticipantSelector
          data-id="4191c5cefbe1"
          isUserAllowedToChange={isPermitted({ user, action: 'audits.changeAuditor', data: { audit } })}
          label="Audited by"
          onChange={(participant) => selectAuditor(participant._id)}
          selectedParticipant={audit.auditor!} />
        {((audit.participants || []).length > 0 || (audit.status === 'upcoming' && isUserPermittedToModify)) && (
          <MultipleParticipantsSelector
            data-id="61dce31e8ab0"
            isUserAllowedToChange={isPermitted({ user, action: 'audits.edit', data: { audit } })}
            label="Participants"
            maxParticipants={20}
            onChange={(participants) => selectParticipants(participants.map((user) => user?._id))}
            selectedParticipants={audit.participants!} />
        )}
      </Stack>
    </Stack>);
}

function AuditsParticipantsWithContext() {
  return <ParticipantsModalProvider data-id="aa1f67143cc0">
    <AuditParticipants data-id="9acfc0a278e1" />
  </ParticipantsModalProvider>
}

export default AuditsParticipantsWithContext;

export const auditParticipantsStyles = {
  auditParticipants: {
    bg: '#FFF',
  },
};
