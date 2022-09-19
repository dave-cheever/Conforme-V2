import { useEffect } from 'react';

import { Flex, Stack, Text, useToast } from '@chakra-ui/react';

import { toastSuccess } from '../../bootstrap/config';
import { isPermitted } from '../../components/can';
import MultipleParticipantsSelector from '../../components/Participants/MultipleParticipantsSelector';
import SingleParticipantSelector from '../../components/Participants/SingleParticipantSelector';
import { useAppContext } from '../../contexts/AppProvider';
import { useAuditContext } from '../../contexts/AuditProvider';
import ParticipantsModalProvider, { useParticipantsModalContext } from '../../contexts/ParticipantsModalProvider';

const AuditParticipants = () => {
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
    <>
      <Stack h={['fit-content', 'full']} spacing={4} w="full">
        <Flex justifyContent={['space-between', 'initial']}>
          <Text fontSize="xxl" fontWeight="semibold">
            Participants
          </Text>
        </Flex>
        <Stack bg="auditParticipants.bg" borderRadius="20px" h="auto" px={6} py={4} rounded="20px" spacing={12} w="full">
          <SingleParticipantSelector
            isUserAllowedToChange={isPermitted({ user, action: 'audits.changeAuditor', data: { audit } })}
            label="Audited by"
            onChange={(participant) => selectAuditor(participant._id)}
            selectedParticipant={audit.auditor!}
          />
          {((audit.participants || []).length > 0 || (audit.status === 'upcoming' && isUserPermittedToModify)) && (
            <MultipleParticipantsSelector
              isUserAllowedToChange={isPermitted({ user, action: 'audits.edit', data: { audit } })}
              label="Participants"
              maxParticipants={20}
              onChange={(participants) => selectParticipants(participants.map((user) => user?._id))}
              selectedParticipants={audit.participants!}
            />
          )}
        </Stack>
      </Stack>
    </>
  );
};

const AuditsParticipantsWithContext = () => (
  <ParticipantsModalProvider>
    <AuditParticipants />
  </ParticipantsModalProvider>
);

export default AuditsParticipantsWithContext;

export const auditParticipantsStyles = {
  auditParticipants: {
    bg: '#FFF',
  },
};
