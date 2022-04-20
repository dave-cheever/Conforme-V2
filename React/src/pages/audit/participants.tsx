import { useState } from 'react';

import { AddIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Stack,
  Text,
} from '@chakra-ui/react';

import AuditTeamModal from '../../components/AuditModal/AuditTeamModal';
import AuditModalProvider from '../../contexts/AuditModalProvider';
import AuditTeamProvider, {
  useAuditTeamContext,
} from '../../contexts/AuditTeamProvider';

const AuditParticipants = () => {
  const { selectedAuditor, selectedParticipants } = useAuditTeamContext();
  const [auditorModalOpen, setAuditorModalOpen] = useState(false);
  const [participantsModalOpen, setParticipantsModalOpen] = useState(false);

  return (
    <>
      <Flex flexDir="column" h={['fit-content', 'full']} w="full">
        <Flex justifyContent={['space-between', 'initial']}>
          <Text fontSize="xxl" fontWeight="semibold">
            Participants
          </Text>
        </Flex>
        <Flex
          bg="auditItem.bg"
          borderRadius="20px"
          flexDir="column"
          h="full"
          mt={4}
          p={['15px 20px 20px 20px', '25px 30px 25px 30px']}
          w="full"
        >
          <Flex direction="column" mb="8">
            <Box mb={10}>
              <AuditTeamModal
                isOpen={auditorModalOpen}
                multiple={false}
                onClose={() => setAuditorModalOpen(false)}
              />
              <Text fontSize="smm" fontWeight="semibold" mb={5} size="md">
                Audited by
              </Text>
              <Stack align="center" fontSize={['14px', '24px']} w="fit-content">
                <Avatar
                  cursor="pointer"
                  name={selectedAuditor?.displayName}
                  onClick={() => setAuditorModalOpen(true)}
                  rounded="full"
                  size="lg"
                  src={selectedAuditor?.imgUrl}
                />
                <Text fontSize="smm" opacity={0.5}>
                  {selectedAuditor?.displayName}
                </Text>
              </Stack>
            </Box>
            <Box mb={10}>
              <AuditTeamModal
                isOpen={participantsModalOpen}
                multiple
                onClose={() => setParticipantsModalOpen(false)}
              />
              <Text fontSize="smm" fontWeight="semibold" mb={5} size="md">
                Participants
              </Text>
              <Grid
                alignItems="center"
                fontSize={['14px', '24px']}
                gap={5}
                templateColumns="repeat(auto-fill, 50px)"
              >
                {selectedParticipants?.map((participant) => (
                  <Stack
                    align="center"
                    fontSize={['14px', '24px']}
                    w="fit-content"
                  >
                    <Avatar
                      cursor="pointer"
                      name={participant?.displayName}
                      onClick={() => setAuditorModalOpen(true)}
                      rounded="full"
                      size="lg"
                      src={participant?.imgUrl}
                    />
                    <Text fontSize="smm" opacity={0.5}>
                      {participant?.displayName}
                    </Text>
                  </Stack>
                ))}
                <GridItem>
                  <IconButton
                    aria-label="Add participant"
                    bg="auditModal.tabs.bottomButton.bg"
                    color="auditModal.participantsButton.color"
                    h="64px"
                    icon={<AddIcon />}
                    isRound
                    onClick={() => setParticipantsModalOpen(true)}
                    w="64px"
                  />
                </GridItem>
              </Grid>
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

const AuditsParticipantsWithContext = () => (
  <AuditTeamProvider>
    <AuditModalProvider>
      <AuditParticipants />
    </AuditModalProvider>
  </AuditTeamProvider>
);

export default AuditsParticipantsWithContext;
