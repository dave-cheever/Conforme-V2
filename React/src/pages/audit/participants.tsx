import { useEffect, useState } from 'react';

import { AddIcon } from '@chakra-ui/icons';
import { Avatar, Flex, Grid, GridItem, IconButton, Stack, Text, useToast } from '@chakra-ui/react';

import { toastSuccess } from '../../bootstrap/config';
import AuditTeamModal from '../../components/AuditModal/AuditTeamModal';
import AuditTeamParticipantAvatar from '../../components/AuditModal/AuditTeamParticipantAvatar';
import { isPermitted } from '../../components/can';
import { useAppContext } from '../../contexts/AppProvider';
import { useAuditContext } from '../../contexts/AuditProvider';
import AuditTeamProvider, { useAuditTeamContext } from '../../contexts/AuditTeamProvider';

const AuditParticipants = () => {
  const toast = useToast();
  const { user } = useAppContext();
  const { audit, updateAudit, refetch } = useAuditContext();
  const { selectedAuditor, setSelectedAuditor, selectedParticipants, setSelectedParticipants } = useAuditTeamContext();
  const [auditorModalOpen, setAuditorModalOpen] = useState(false);
  const [participantsModalOpen, setParticipantsModalOpen] = useState(false);
  const isUserPermittedToModify = isPermitted({ user, action: 'audits.edit', data: { audit } });

  useEffect(() => {
    setSelectedAuditor(audit.auditor ?? {});
    setSelectedParticipants(audit.participants ?? []);
  }, [JSON.stringify(audit)]);

  const handleAuditorSelect = async () => {
    setAuditorModalOpen(false);
    await updateAudit({
      variables: {
        audit: {
          _id: audit._id,
          auditorId: selectedAuditor._id,
        },
      },
    });
    toast({ ...toastSuccess, description: 'Auditor updated' });
    refetch();
  };

  const handleParticipantsSelect = async () => {
    setParticipantsModalOpen(false);
    await updateAudit({
      variables: {
        audit: {
          _id: audit._id,
          participantsIds: selectedParticipants.map((user) => user?._id),
        },
      },
    });
    toast({ ...toastSuccess, description: 'Participants updated' });
    refetch();
  };

  return (
    <>
      <AuditTeamModal
        isOpen={auditorModalOpen && isPermitted({ user, action: 'audits.admin' })}
        multiple={false}
        onCancel={handleAuditorSelect}
        onClose={handleAuditorSelect}
        selection="auditor"
      />
      <AuditTeamModal
        isOpen={participantsModalOpen}
        multiple
        onCancel={handleParticipantsSelect}
        onClose={handleParticipantsSelect}
        selection="participants"
      />
      <Stack h={['fit-content', 'full']} spacing={4} w="full">
        <Flex justifyContent={['space-between', 'initial']}>
          <Text fontSize="xxl" fontWeight="semibold">
            Participants
          </Text>
        </Flex>
        <Stack bg="auditParticipants.bg" borderRadius="20px" h="full" px={6} py={4} rounded="20px" spacing={6} w="full">
          <Stack spacing={4}>
            <Text fontSize="smm" fontWeight="semibold">
              Audited by
            </Text>
            <Flex align="center" direction="column" fontSize={['14px', '24px']} position="relative" textAlign="center" w="64px">
              <Avatar
                cursor={audit.status === 'upcoming' && isUserPermittedToModify ? 'pointer' : 'default'}
                name={audit.auditor?.displayName}
                onClick={() => audit.status === 'upcoming' && isUserPermittedToModify && setAuditorModalOpen(true)}
                rounded="full"
                size="lg"
                src={audit.auditor?.imgUrl}
              />
              <Text fontSize="ssm" fontWeight="semi_medium" mt="10px">
                {audit.auditor?.displayName}
              </Text>
            </Flex>
          </Stack>
          {((audit.participants || []).length > 0 || (audit.status === 'upcoming' && isUserPermittedToModify)) && (
            <Stack spacing={4}>
              <Text fontSize="smm" fontWeight="semibold">
                Participants
              </Text>
              <Grid fontSize={['14px', '24px']} gap={6} templateColumns="repeat(auto-fill, 64px)">
                {audit.participants?.map((participant) => {
                  if (!participant) return null;
                  return (
                    <GridItem key={participant._id}>
                      <AuditTeamParticipantAvatar
                        audit={audit}
                        disabled={!isUserPermittedToModify}
                        participant={participant}
                        setParticipantsModalOpen={setParticipantsModalOpen}
                      />
                    </GridItem>
                  );
                })}
                {audit.status === 'upcoming' && isUserPermittedToModify && (
                  <GridItem>
                    <IconButton
                      aria-label="Add participant"
                      bg="auditModal.addParticipant.bg"
                      color="auditModal.addParticipant.color"
                      h="64px"
                      icon={<AddIcon />}
                      isRound
                      onClick={() => setParticipantsModalOpen(true)}
                      w="64px"
                    />
                  </GridItem>
                )}
              </Grid>
            </Stack>
          )}
        </Stack>
      </Stack>
    </>
  );
};

const AuditsParticipantsWithContext = () => (
  <AuditTeamProvider>
    <AuditParticipants />
  </AuditTeamProvider>
);

export default AuditsParticipantsWithContext;

export const auditParticipantsStyles = {
  auditParticipants: {
    bg: '#FFF',
  },
};
