import { useContext, useEffect, useState } from 'react';

import { gql, useLazyQuery } from '@apollo/client';
import { AddIcon } from '@chakra-ui/icons';
import {
  Alert,
  Avatar,
  Button,
  Flex,
  Grid,
  GridItem,
  Icon,
  IconButton,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spacer,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { t } from 'i18next';
import { isEmpty } from 'lodash';

import { toastFailed } from '../../bootstrap/config';
import { AdminContext } from '../../contexts/AdminProvider';
import { useAppContext } from '../../contexts/AppProvider';
import { useAuditModalContext } from '../../contexts/AuditModalProvider';
import { useAuditTeamContext } from '../../contexts/AuditTeamProvider';
import useAuditModal from '../../hooks/useAuditModal';
import useNavigate from '../../hooks/useNavigate';
import { Close, TickIcon } from '../../icons';
import { IUser } from '../../interfaces/IUser';
import { Dropdown } from '../Forms';
import AuditTeamModal from './AuditTeamModal';
import AuditTeamParticipantAvatar from './AuditTeamParticipantAvatar';

const GET_DUPLICATE_AUDITS = gql`
  query getDuplicateAudits($auditQueryInput: AuditQueryInput) {
    audits(auditQueryInput: $auditQueryInput) {
      _id
      auditType {
        name
      }
      area {
        name
      }
    }
  }
`;

const AuditModal = ({ refetch }) => {
  const toast = useToast();
  const { navigateTo, openInNewTab } = useNavigate();
  const { user } = useAppContext();
  const [getDuplicateAudits, { data }] = useLazyQuery(GET_DUPLICATE_AUDITS, { fetchPolicy: 'network-only' });
  const { audit, control, setValue, auditTypes, locations, businessUnits, reset } = useAuditModalContext();
  const { selectedAuditor, selectedParticipants } = useAuditTeamContext();
  const { saveAudit, closeModal } = useAuditModal(refetch);
  const { adminModalState, setAdminModalState } = useContext(AdminContext);
  const [auditorModalOpen, setAuditorModalOpen] = useState(false);
  const [participantsModalOpen, setParticipantsModalOpen] = useState(false);

  useEffect(() => {
    if (adminModalState !== 'closed' && auditTypes.length === 1) setValue('auditTypeId', auditTypes[0]._id);
    return () => reset({ ...audit });
  }, [adminModalState, JSON.stringify(auditTypes)]);

  useEffect(() => {
    const { areaId, walkType, auditTypeId } = audit;

    if (!isEmpty(auditTypeId) && walkType === 'physical' && !isEmpty(areaId)) {
      getDuplicateAudits({
        variables: {
          auditQueryInput: {
            areasIds: [areaId],
            walkType: [walkType],
            auditTypesIds: [auditTypeId],
            status: ['upcoming'],
          },
        },
      });
    }
  }, [JSON.stringify(audit)]);

  const handlePrimaryButtonClick = async () => {
    if (!audit.auditTypeId) {
      return toast({
        ...toastFailed,
        description: 'You need to create an audit type',
      });
    }

    const { metatags, ...auditValues } = audit;
    const auditId = await saveAudit(auditValues);

    if (auditId) {
      setAdminModalState('closed');
      navigateTo(`/audits/${auditId}`);
    }
  };

  return (
    <>
      <AuditTeamModal
        isOpen={auditorModalOpen}
        multiple={false}
        onCancel={() => {
          setAuditorModalOpen(false);
        }}
        onClose={() => {
          setValue('auditorId', selectedAuditor._id);
          setAuditorModalOpen(false);
        }}
        selection="auditor"
      />
      <AuditTeamModal
        isOpen={participantsModalOpen}
        multiple
        onCancel={() => {
          setParticipantsModalOpen(false);
        }}
        onClose={() => {
          setValue(
            'participantsIds',
            selectedParticipants.map((participant) => (participant as IUser)?._id),
          );
          setParticipantsModalOpen(false);
        }}
        selection="participants"
      />
      <ModalContent bg="actionModal.bg" h="100vh" m="0" overflow="hidden" p={[4, 6]} rounded="0">
        <ModalHeader alignItems="center" fontSize="xxl" fontWeight="bold" p="0">
          <Flex justifyContent="space-between">
            <Flex alignItems="center" fontSize={['14px', '24px']}>
              <Avatar mr={3} name={user?.displayName} rounded="full" size="xs" src={user?.imgUrl} />
              New {t('audit')}
            </Flex>
            <Flex alignItems="center">
              <Close cursor="pointer" h="15px" onClick={closeModal} stroke="auditModal.closeIcon" w="15px" />
            </Flex>
          </Flex>
        </ModalHeader>
        <ModalBody h="calc(100% - 1rem)" p="1rem 0 0 0">
          <Stack h="100%" justify="space-between" spacing={2}>
            <Stack flexGrow={1} overflowY="auto" px={2} py={0} spacing={6}>
              <Flex direction="column">
                <Text fontSize="smm" fontWeight="semibold">
                  Details
                </Text>
                <Grid columnGap={4} rowGap={2} templateColumns="repeat(2, 1fr)">
                  {auditTypes?.length > 1 && !audit?.auditTypeId && (
                    <GridItem w="100%">
                      <Dropdown
                        control={control}
                        label="Audit Type"
                        name="auditTypeId"
                        options={(auditTypes ?? []).map((auditType) => ({
                          value: auditType._id,
                          label: auditType.name,
                        }))}
                        placeholder="Select audit type"
                        stroke="dropdown.icon"
                        validations={{
                          notEmpty: true,
                        }}
                      />
                    </GridItem>
                  )}
                  <GridItem w="100%">
                    <Dropdown
                      control={control}
                      label="Type"
                      name="walkType"
                      options={[
                        { value: 'virtual', label: 'Virtual' },
                        { value: 'physical', label: 'Physical' },
                      ]}
                      placeholder="Select walk type"
                      required
                      stroke="dropdown.icon"
                      validations={{
                        notEmpty: true,
                      }}
                      variant="secondaryVariant"
                    />
                  </GridItem>

                  <GridItem w="100%">
                    <Dropdown
                      control={control}
                      label="Site"
                      name="siteId"
                      options={(locations ?? []).map((location) => ({
                        value: location._id,
                        label: location.name,
                      }))}
                      placeholder="Select site"
                      required
                      stroke="dropdown.icon"
                      validations={{
                        notEmpty: true,
                      }}
                      variant="secondaryVariant"
                    />
                  </GridItem>
                  <GridItem w="100%">
                    <Dropdown
                      control={control}
                      label="Area"
                      name="areaId"
                      options={(businessUnits ?? []).map((businessUnit) => ({
                        value: businessUnit._id,
                        label: businessUnit.name,
                      }))}
                      placeholder="Select Area"
                      required
                      stroke="dropdown.icon"
                      validations={{
                        notEmpty: true,
                      }}
                      variant="secondaryVariant"
                    />
                  </GridItem>
                </Grid>
              </Flex>
              <Text fontSize="smm" fontWeight="semibold">
                Audited by
              </Text>
              <Flex align="center" direction="column" fontSize={['14px', '24px']} position="relative" textAlign="center" w="64px">
                <Avatar
                  cursor="pointer"
                  name={selectedAuditor?.displayName}
                  onClick={() => setAuditorModalOpen(true)}
                  rounded="full"
                  size="lg"
                  src={selectedAuditor?.imgUrl}
                />
                <Text fontSize="ssm" fontWeight="semi_medium" mt="10px">
                  {selectedAuditor.displayName}
                </Text>
              </Flex>
              <Text fontSize="smm" fontWeight="semibold">
                Participants
              </Text>
              <Grid fontSize={['14px', '24px']} gap={6} templateColumns="repeat(auto-fill, 64px)">
                {selectedParticipants?.map((participant) => {
                  if (!participant) return null;
                  return (
                    <GridItem key={participant._id}>
                      <AuditTeamParticipantAvatar participant={participant} setParticipantsModalOpen={setParticipantsModalOpen} />
                    </GridItem>
                  );
                })}
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
              </Grid>
            </Stack>
            <Flex flexBasis="calc(40px + 1rem)" flexShrink={0} justify="space-between" pt={4} w="full">
              {data?.audits?.length > 0 && (
                <Alert status="warning">
                  <Text as="h3">
                    {data?.audits?.[0].auditType.name} for {data?.audits?.[0].area.name} for {format(new Date(), 'MMMM Y')} already{' '}
                    <Text
                      _hover={{
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                      as="span"
                      color="auditModal.existentAuditLink.color"
                      onClick={() => openInNewTab(`/audits/${data?.audits?.[0]?._id}`)}
                    >
                      exists
                    </Text>
                  </Text>
                </Alert>
              )}
              <Spacer />
              <Button
                bg="auditModal.tabs.bottomButton.bg"
                color="auditModal.tabs.bottomButton.color"
                disabled={!audit.walkType || !audit.siteId || !audit.areaId}
                fontSize="smm"
                fontWeight="700"
                h="40px"
                ml={3}
                onClick={() => {
                  handlePrimaryButtonClick();
                }}
                rightIcon={<Icon as={TickIcon} size={24} stroke="auditModal.tabs.bottomButton.icon" />}
                rounded="10px"
                w="fit-content"
              >
                Start {t('audit')}
              </Button>
            </Flex>
          </Stack>
        </ModalBody>
      </ModalContent>
    </>
  );
};

export default AuditModal;

export const auditModalStyles = {
  auditModal: {
    bg: '#ffffff',
    addParticipant: {
      bg: '#1E1836',
      color: '#FFFFFF',
    },
    existentAuditLink: {
      color: '#dc0043',
    },
    saveButton: {
      bg: '#F0F2F5',
      color: '#424B50',
      icon: '#818197',
    },
    closeIcon: '#282F36',
    tabs: {
      bg: '#F0F2F5',
      bottomButton: {
        bg: '#DC0043',
        color: '#ffffff',
        icon: '#ffffff',
        hover: '#DC0043',
      },
    },
  },
};
