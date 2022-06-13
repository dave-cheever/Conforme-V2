import { useContext, useEffect, useState } from 'react';

import { AddIcon } from '@chakra-ui/icons';
import {
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
import { t } from 'i18next';

import { toastFailed } from '../../bootstrap/config';
import { AdminContext } from '../../contexts/AdminProvider';
import { useAppContext } from '../../contexts/AppProvider';
import { useAuditModalContext } from '../../contexts/AuditModalProvider';
import { useAuditTeamContext } from '../../contexts/AuditTeamProvider';
import useAuditModal from '../../hooks/useAuditModal';
import useNavigate from '../../hooks/useNavigate';
import { Close, TickIcon } from '../../icons';
import { IUser } from '../../interfaces/IUser';
import { Datepicker, Dropdown } from '../Forms';
import AuditTeamModal from './AuditTeamModal';

const AuditModal = ({ refetch }) => {
  const toast = useToast();
  const { navigateTo } = useNavigate();
  const { user } = useAppContext();
  const { audit, control, defaultValues, setValue, auditTypes, locations, businessUnits, reset } = useAuditModalContext();
  const { selectedAuditor, selectedParticipants, setSelectedAuditor, setSelectedParticipants } = useAuditTeamContext();
  const { saveAudit, closeModal } = useAuditModal(refetch);
  const { adminModalState, setAdminModalState } = useContext(AdminContext);
  const [auditorModalOpen, setAuditorModalOpen] = useState(false);
  const [participantsModalOpen, setParticipantsModalOpen] = useState(false);

  useEffect(() => {
    if (adminModalState !== 'closed' && auditTypes.length === 1) setValue('auditTypeId', auditTypes[0]._id);

    return () => reset({ ...audit });
  }, [adminModalState]);

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
          setValue('auditorId', defaultValues.auditorId);
          setSelectedAuditor(user as IUser);
          setAuditorModalOpen(false);
        }}
        onClose={() => {
          setValue('auditorId', selectedAuditor._id);
          setAuditorModalOpen(false);
        }}
      />
      <AuditTeamModal
        isOpen={participantsModalOpen}
        multiple
        onCancel={() => {
          setValue('participantsIds', defaultValues.participantsIds);
          setSelectedParticipants([]);
          setParticipantsModalOpen(false);
        }}
        onClose={() => {
          setValue(
            'participantsIds',
            selectedParticipants.map((participant) => (participant as IUser)?._id),
          );
          setParticipantsModalOpen(false);
        }}
      />
      <ModalContent bg="auditModal.bg" h="100%" m="0" p={['25px', '35px']} position="absolute" rounded="0">
        <ModalHeader alignItems="center" fontSize="xxl" fontWeight="bold" p="0 0 20px 0">
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
        <ModalBody h="calc(100% - 175px)" p="0">
          <Stack h="full" spacing={4}>
            <Stack overflowY="auto" spacing={4}>
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
                  {audit.walkType === 'physical' && (
                    <>
                      <GridItem w="100%">
                        <Datepicker
                          control={control}
                          disabled
                          label="Start date (today)"
                          name="metatags.addedAt"
                          variant="secondaryVariant"
                        />
                      </GridItem>
                    </>
                  )}
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
                  {selectedAuditor.firstName || selectedAuditor.lastName
                    ? `${selectedAuditor.firstName} ${selectedAuditor.lastName}`
                    : selectedAuditor.displayName}
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
                      <Flex align="center" direction="column" fontSize={['14px', '24px']} position="relative" textAlign="center" w="64px">
                        <Avatar cursor="pointer" name={participant.displayName} rounded="full" size="lg" src={participant.imgUrl} />
                        <Text fontSize="ssm" fontWeight="semi_medium" mt="10px">
                          {participant.firstName || participant.lastName
                            ? `${participant.firstName} ${participant.lastName}`
                            : participant.displayName}
                        </Text>
                      </Flex>
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
            <Spacer />
            <Flex justifyContent="flex-end" w="full">
              <Button
                bg="auditModal.tabs.bottomButton.bg"
                color="auditModal.tabs.bottomButton.color"
                disabled={!audit.walkType || (audit.walkType === 'physical' && (!audit.siteId || !audit.areaId))}
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
                Start Audit
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
