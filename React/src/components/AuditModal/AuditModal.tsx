import { useContext, useEffect } from 'react';

import { gql, useLazyQuery } from '@apollo/client';
import {
  Alert,
  Avatar,
  Button,
  Flex,
  Grid,
  GridItem,
  Icon,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { t } from 'i18next';
import { capitalize, isEmpty } from 'lodash';

import { toastFailed } from '../../bootstrap/config';
import { AdminContext } from '../../contexts/AdminProvider';
import { useAppContext } from '../../contexts/AppProvider';
import { useAuditModalContext } from '../../contexts/AuditModalProvider';
import useAuditModal from '../../hooks/useAuditModal';
import useNavigate from '../../hooks/useNavigate';
import { Close, TickIcon } from '../../icons';
import { IUser } from '../../interfaces/IUser';
import { Dropdown } from '../Forms';
import MultipleParticipantsSelector from '../Participants/MultipleParticipantsSelector';
import SingleParticipantSelector from '../Participants/SingleParticipantSelector';

const GET_DUPLICATE_AUDITS = gql`
  query getDuplicateAudits($auditQueryInput: AuditQueryInput) {
    audits(auditQueryInput: $auditQueryInput) {
      _id
      auditType {
        name
      }
      businessUnit {
        name
      }
    }
  }
`;

function AuditModal({ refetch }) {
  const toast = useToast();
  const { navigateTo, openInNewTab } = useNavigate();
  const { module, user } = useAppContext();
  const [getDuplicateAudits, { data }] = useLazyQuery(GET_DUPLICATE_AUDITS, { fetchPolicy: 'network-only' });
  const {
    audit,
    control,
    setValue,
    auditTypes,
    locations,
    businessUnits,
    reset,
    selectedAuditor,
    setSelectedAuditor,
    selectedParticipants,
    setSelectedParticipants,
  } = useAuditModalContext();
  const { saveAudit, closeModal } = useAuditModal(refetch);
  const { adminModalState, setAdminModalState } = useContext(AdminContext);

  useEffect(() => {
    if (adminModalState !== 'closed' && auditTypes.length === 1) setValue('auditTypeId', auditTypes[0]._id);
    return () => reset({ ...audit });
  }, [adminModalState, JSON.stringify(auditTypes)]);

  const selectAuditor = (user: IUser) => {
    setValue('auditorId', user.userId);
    setSelectedAuditor(user);
  };

  const selectParticipants = (users: IUser[]) => {
    setValue(
      'participantsIds',
      users.map((user) => user.userId).filter((id): id is string => id !== undefined),
    );
    setSelectedParticipants(users);
  };

  useEffect(() => {
    const { businessUnitId, walkType, auditTypeId } = audit;

    if (!isEmpty(auditTypeId) && walkType === 'physical' && !isEmpty(businessUnitId)) {
      getDuplicateAudits({
        variables: {
          auditQueryInput: {
            businessUnitsIds: [businessUnitId],
            walkType: [walkType],
            auditTypesIds: [auditTypeId],
            status: ['upcoming'],
          },
        },
      });
    }
  }, [JSON.stringify(audit)]);

  const handlePrimaryButtonClick = async () => {
    const auditType = auditTypes.find(({ _id }) => _id === audit.auditTypeId);
    if (!auditType) {
      return toast({
        ...toastFailed,
        description: `You need to ${!auditTypes || auditTypes.length == 0 ? 'create' : 'select'} an audit type`,
      });
    }

    const { metatags, ...auditValues } = audit;
    const auditId = await saveAudit({ ...auditValues, recurring: auditType.recurring });

    if (auditId) {
      setAdminModalState('closed');
      navigateTo(`/audits/${auditId}`);
    }
  };

  const handleAddAndResetAudit = async () => {
    const auditType = auditTypes.find(({ _id }) => _id === audit.auditTypeId);
    if (!auditType) {
      return toast({
        ...toastFailed,
        description: `You need to ${!auditTypes || auditTypes.length === 0 ? 'create' : 'select'} an audit type`,
      });
    }

    const { metatags, ...auditValues } = audit;
    const auditId = await saveAudit({ ...auditValues, recurring: auditType.recurring });

    if (auditId) 
      reset({ ...audit, auditTypeId: undefined, walkType: undefined, locationId: undefined, businessUnitId: undefined });
    
};

  return (
    <ModalContent
        data-id="000345"
        bg="auditModal.bg"
        h="100%"
        m="0"
        overflow="hidden"
        p={[4, 6]}
        rounded="0">
      <ModalHeader
        data-id="000346"
        alignItems="center"
        fontSize="xxl"
        fontWeight="bold"
        p="0">
        <Flex data-id="000347" justifyContent="space-between">
          <Flex data-id="000348" alignItems="center" fontSize={['14px', '24px']}>
            <Avatar
              data-id="000349"
              mr={3}
              name={user?.displayName?.replace(/\s*\(.*?\)\s*/g, '')} 
              rounded="full"
              size="xs"
              src={user?.imgUrl} />
            New {t('audit')}
          </Flex>
          <Flex data-id="000350" alignItems="center">
            <Close
              data-id="000351"
              cursor="pointer"
              h="15px"
              onClick={closeModal}
              stroke="auditModal.closeIcon"
              w="15px" />
          </Flex>
        </Flex>
      </ModalHeader>
      <ModalBody data-id="000352" overflowY="auto" p="1rem 0 0 0">
        <Stack data-id="000353" justify="space-between" spacing={2}>
          <Stack
            data-id="000354"
            flexGrow={1}
            justify="space-between"
            overflowY="auto"
            px={2}
            py={0}
            spacing={6}>
            <Flex data-id="000355" direction="column">
              <Text data-id="000356" fontSize="smm" fontWeight="semibold">
                Details
              </Text>
              <Grid
                data-id="000357"
                columnGap={4}
                rowGap={2}
                templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']}>
                  <GridItem data-id="000358" w="100%">
                    <Dropdown
                      data-id="000359"
                      control={control}
                      disabled={auditTypes?.length === 1}
                      label="Audit Type"
                      name="auditTypeId"
                      options={(auditTypes ?? []).map((auditType) => ({
                        value: auditType._id,
                        label: auditType.name,
                      }))}
                      placeholder="Select audit type"
                      required
                      stroke="dropdown.icon"
                      validations={{
                        notEmpty: true,
                      }} />
                  </GridItem>
                {module?.featureFlags?.enableSafetyWalk && 
                  <GridItem data-id="000360" w="100%">
                    <Dropdown
                      data-id="000361"
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
                      variant="secondaryVariant" />
                  </GridItem>
                }
                <GridItem data-id="000362" w="100%">
                  <Dropdown
                    data-id="000363"
                    control={control}
                    label={capitalize(t('location'))}
                    name="locationId"
                    options={(locations ?? []).map((location) => ({
                      value: location._id,
                      label: location.name,
                    }))}
                    placeholder="Select location"
                    required
                    stroke="dropdown.icon"
                    validations={{
                      notEmpty: true,
                    }}
                    variant="secondaryVariant" />
                </GridItem>
                {audit.auditTypeId && auditTypes.find(({ _id }) => _id === audit.auditTypeId)?.businessUnitScope === 'audit' && (
                  <GridItem data-id="000364" w="100%">
                    <Dropdown
                      data-id="000365"
                      control={control}
                      label={capitalize(t('business unit'))}
                      name="businessUnitId"
                      options={(businessUnits ?? []).map((businessUnit) => ({
                        value: businessUnit._id,
                        label: businessUnit.name,
                      }))}
                      placeholder={`Select ${capitalize(t('business unit'))}`}
                      required
                      stroke="dropdown.icon"
                      validations={{
                        notEmpty: true,
                      }}
                      variant="secondaryVariant" />
                  </GridItem>
                )}
              </Grid>
            </Flex>
            <SingleParticipantSelector
              data-id="000366"
              isUserAllowedToChange
              label="Audited by"
              onChange={selectAuditor}
              selectedParticipant={selectedAuditor} />
            <MultipleParticipantsSelector
              data-id="000367"
              isUserAllowedToChange
              label="Participants"
              onChange={selectParticipants}
              selectedParticipants={selectedParticipants} />
            <Flex
              data-id="000368"
              flexBasis="calc(40px + 1rem)"
              flexShrink={0}
              justify="space-between"
              pt={4}
              w="full">
              {data?.audits?.length > 0 && (
                <Alert data-id="000369" status="warning">
                  <Text data-id="000370" as="h3">
                    {data?.audits?.[0].auditType.name} for {data?.audits?.[0].businessUnit.name} for {format(new Date(), 'MMMM Y')} already{' '}
                    <Text
                      data-id="000371"
                      _hover={{
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                      as="span"
                      color="auditModal.existentAuditLink.color"
                      onClick={() => openInNewTab(`/audits/${data?.audits?.[0]?._id}`)}>
                      exists
                    </Text>
                  </Text>
                </Alert>
              )}
            </Flex>
          </Stack>
        </Stack>
      </ModalBody>
      <ModalFooter data-id="000372" p={1}>
        <Button
          data-id="000373"
          bg="auditModal.tabs.bottomButton.bg"
          color="auditModal.tabs.bottomButton.color"
          fontSize="smm"
          fontWeight="500"
          h="40px"
          minW="inherit"
          ml={3}
          onClick={handleAddAndResetAudit}
          rounded="10px"
          variant="outline">
          Start & Add More
        </Button>

        <Button
          data-id="000374"
          bg="auditModal.tabs.bottomButton.bg"
          color="auditModal.tabs.bottomButton.color"
          disabled={
            module?.featureFlags?.enableSafetyWalk && !audit.walkType ||
            !audit.locationId ||
            !!(
              audit.auditTypeId &&
              auditTypes.find(({ _id }) => _id === audit.auditTypeId)?.businessUnitScope === 'audit' &&
              !audit.businessUnitId
            )
          }
          fontSize="smm"
          fontWeight="500"
          h="40px"
          minW="inherit"
          ml={3}
          onClick={() => {
            handlePrimaryButtonClick();
          }}
          rightIcon={<Icon
            data-id="000375"
            as={TickIcon}
            size={24}
            stroke="auditModal.tabs.bottomButton.icon" />}
          rounded="10px"
          w="max-content">
          Start {t('audit')}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}

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
        bg: '#462AC4',
        color: '#ffffff',
        icon: '#ffffff',
        hover: '#DC0043',
      },
    },
  },
};
