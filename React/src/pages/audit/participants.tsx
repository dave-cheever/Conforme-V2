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

  return (
    <Stack data-id="000674" border="1px solid #CBD5E0" h={['fit-content', 'full']} p="10px" rounded="10px" spacing={4} w="full">
      <Flex data-id="000675" justifyContent={['space-between', 'initial']}>
        <Text data-id="000676" fontSize={['20px', 'xxl']} fontWeight="semibold">
          Participants
        </Text>
      </Flex>
      <Stack
        data-id="000677"
        bg="auditParticipants.bg"
        borderRadius="20px"
        h="full"
        overflow="auto"
        px={[2, 6]}
        py={[2, 4]}
        rounded="20px"
        spacing={12}
        w="full"
      >
        <SingleParticipantSelector
          data-id="000678"
          isUserAllowedToChange={isPermitted({ user, action: 'audits.changeAuditor', data: { audit } })}
          label="Audited by"
          onChange={(participant) => selectAuditor(participant.userId)}
          selectedParticipant={audit.auditor!}
        />
        {((audit.participants || []).length > 0 || (audit.status === 'upcoming' && isUserPermittedToModify)) && (
          <MultipleParticipantsSelector
            data-id="000679"
            isUserAllowedToChange={isPermitted({ user, action: 'audits.edit', data: { audit } })}
            label="Participants"
            maxParticipants={20}
            onChange={(participants) => selectParticipants(participants.map((user) => user?.userId))}
            onRemove={(participantId, selectedParticipants) => {
              const updated = selectedParticipants.filter((p) => p.userId !== participantId);
              const updatedIds = updated.map((p) => p.userId);
              selectParticipants(updatedIds);
            }}
            selectedParticipants={audit.participants!}
          />
        )}
      </Stack>
    </Stack>
  );
}

function AuditsParticipantsWithContext() {
  return (
    <ParticipantsModalProvider data-id="000680">
      <AuditParticipants data-id="000681" />
    </ParticipantsModalProvider>
  );
}

export default AuditsParticipantsWithContext;

export const auditParticipantsStyles = {
  auditParticipants: {
    bg: '#FFF',
  },
};
