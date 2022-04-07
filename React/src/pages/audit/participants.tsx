import { useState } from 'react';

import { AddIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
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
        <Flex
          alignItems="center"
          justifyContent={['space-between', 'initial']}
          mb="8"
        >
          <Heading mb={3}>Participants</Heading>
        </Flex>
        <Flex
          bg="auditItem.bg"
          borderRadius="20px"
          flexDir="column"
          h="full"
          p={['15px 20px 20px 20px', '25px 30px 25px 30px']}
          w="full"
        >
          <Flex align="center" direction="column" mb="8">
            <Box mb={10}>
              <AuditTeamModal
                isOpen={auditorModalOpen}
                multiple={false}
                onClose={() => setAuditorModalOpen(false)}
              />
              <Heading as="h4" mb={5} size="md">
                Audited by
              </Heading>
              <Flex alignItems="center" fontSize={['14px', '24px']}>
                <Avatar
                  cursor="pointer"
                  mr={3}
                  name={selectedAuditor?.displayName}
                  onClick={() => setAuditorModalOpen(true)}
                  rounded="full"
                  size="md"
                  src={selectedAuditor?.imgUrl}
                />
              </Flex>
            </Box>
            <Box mb={10}>
              <AuditTeamModal
                isOpen={participantsModalOpen}
                multiple
                onClose={() => setParticipantsModalOpen(false)}
              />
              <Heading as="h4" mb={5} size="md">
                Participants
              </Heading>
              <Grid
                alignItems="center"
                fontSize={['14px', '24px']}
                gap={5}
                templateColumns="repeat(auto-fill, 50px)"
              >
                {selectedParticipants?.map((participant) => (
                  <GridItem key={participant?._id}>
                    <Avatar
                      cursor="pointer"
                      mr={3}
                      name={participant?.displayName}
                      rounded="full"
                      size="md"
                      src={participant?.imgUrl}
                    />
                  </GridItem>
                ))}
                <GridItem>
                  <IconButton
                    aria-label="Add participant"
                    bg="auditModal.tabs.bottomButton.bg"
                    icon={<AddIcon />}
                    isRound
                    onClick={() => setParticipantsModalOpen(true)}
                    size="lg"
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
