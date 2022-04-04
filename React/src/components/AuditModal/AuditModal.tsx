import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { AddIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  IconButton,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spacer,
  useToast,
} from '@chakra-ui/react';

import { toastFailed } from '../../bootstrap/config';
import { AdminContext } from '../../contexts/AdminProvider';
import { useAppContext } from '../../contexts/AppProvider';
import { useAuditModalContext } from '../../contexts/AuditModalProvider';
import { useAuditTeamContext } from '../../contexts/AuditTeamProvider';
import useAuditModal from '../../hooks/useAuditModal';
import { Close, TickIcon } from '../../icons';
import Dropdown from '../Forms/Dropdown';
import AuditTeamModal from './AuditTeamModal';

const AuditModal = ({ refetch }) => {
  const toast = useToast();
  const history = useHistory();
  const { user } = useAppContext();
  const {
    audit,
    control,
    setValue,
    auditTypes,
    locations,
    businessUnits,
    errors,
    reset,
  } = useAuditModalContext();
  const { selectedAuditor, selectedParticipants } = useAuditTeamContext();
  const { saveAudit, closeModal } = useAuditModal(refetch);
  const { setAdminModalState } = useContext(AdminContext);
  const [auditorModalOpen, setAuditorModalOpen] = useState(false);
  const [participantsModalOpen, setParticipantsModalOpen] = useState(false);

  useEffect(() => {
    if (auditTypes.length === 1) setValue('auditTypeId', auditTypes[0]._id);

    return () => {
      reset({ ...audit });
    };
  }, [auditTypes]);

  useEffect(() => {
    if (selectedAuditor) setValue('auditorId', selectedAuditor._id);
  }, [selectedAuditor]);

  useEffect(() => {
    if (selectedParticipants.length > 0) {
      setValue(
        'participantsIds',
        selectedParticipants.map((participant) => participant?._id) as string[],
      );
    }
  }, [selectedParticipants]);

  const handlePrimaryButtonClick = async () => {
    if (!audit.auditTypeId) {
      return toast({
        ...toastFailed,
        description: 'You need to create an audit type',
      });
    }

    if (Object.keys(errors).length > 0) {
      return toast({
        ...toastFailed,
        description: 'Please complete all the required fields',
      });
    }

    const auditId = await saveAudit({
      ...audit,
    });
    setAdminModalState('closed');
    history.push(`audits/${auditId}`);
  };

  return (
    <>
      <ModalContent
        bg="auditModal.bg"
        h="100%"
        m="0"
        p={['25px', '35px']}
        position="absolute"
        rounded="0"
      >
        <ModalHeader
          alignItems="center"
          fontSize="xxl"
          fontWeight="bold"
          p="0 0 20px 0"
        >
          <Flex justifyContent="space-between">
            <Flex alignItems="center" fontSize={['14px', '24px']}>
              <Avatar
                mr={3}
                name={user?.displayName}
                rounded="full"
                size="xs"
                src={user?.imgUrl}
              />
              New Audit
            </Flex>
            <Flex alignItems="center">
              <Close
                cursor="pointer"
                h="15px"
                onClick={closeModal}
                stroke="auditModal.closeIcon"
                w="15px"
              />
            </Flex>
          </Flex>
        </ModalHeader>
        <ModalBody h="calc(100% - 175px)" p="0">
          <Heading as="h4" mb={5} size="md">
            Walk details
          </Heading>
          <Flex direction="column" height="calc(100% - 60px)" mb="20px">
            <Grid gap={5} templateColumns="repeat(2, 1fr)">
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
                    variant="secondaryVariant"
                  />
                </GridItem>
              )}
              <GridItem w="100%">
                <Dropdown
                  control={control}
                  label="Walk Type"
                  name="walkType"
                  options={[
                    { value: 'virtual', label: 'Virtual' },
                    { value: 'physical', label: 'Physical' },
                  ]}
                  placeholder="Select walk type"
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
                  stroke="dropdown.icon"
                  validations={{
                    notEmpty: true,
                  }}
                  variant="secondaryVariant"
                />
              </GridItem>
              <GridItem w="100%">
                {audit.walkType === 'physical' && (
                  <Dropdown
                    control={control}
                    label="Area"
                    name="areaId"
                    options={(businessUnits ?? []).map((businessUnit) => ({
                      value: businessUnit._id,
                      label: businessUnit.name,
                    }))}
                    placeholder="Select Area"
                    stroke="dropdown.icon"
                    variant="secondaryVariant"
                  />
                )}
              </GridItem>
            </Grid>
            <Box mt={3}>
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
            <Box mt={3}>
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
                    icon={<AddIcon color="#fff" size="sm" />}
                    isRound
                    onClick={() => setParticipantsModalOpen(true)}
                    size="lg"
                  />
                </GridItem>
              </Grid>
            </Box>
            <Spacer />
            <Flex justifyContent="flex-end" w="full">
              <Button
                bg="auditModal.tabs.bottomButton.bg"
                color="auditModal.tabs.bottomButton.color"
                disabled={Object.keys(errors).length > 0}
                fontSize="smm"
                fontWeight="700"
                h="40px"
                ml={3}
                onClick={() => {
                  handlePrimaryButtonClick();
                }}
                rightIcon={
                  <Icon
                    as={TickIcon}
                    size={24}
                    stroke="auditModal.tabs.bottomButton.icon"
                  />
                }
                rounded="10px"
                w="fit-content"
              >
                Start Audit
              </Button>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </>
  );
};

export default AuditModal;

export const auditModalStyles = {
  auditModal: {
    bg: '#ffffff',
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
