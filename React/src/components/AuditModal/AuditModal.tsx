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
        bg="auditModal.bg"
        data-id="030925-48a779"
        h="100%"
        m="0"
        overflow="hidden"
        p={[4, 6]}
        rounded="0">
      <ModalHeader
        alignItems="center"
        data-id="030925-21d3ce"
        fontSize="xxl"
        fontWeight="bold"
        p="0">
        <Flex data-id="030925-1e02ec" justifyContent="space-between">
          <Flex alignItems="center" data-id="030925-4491b1" fontSize={['14px', '24px']}>
            <Avatar
              data-id="030925-45a012"
              mr={3}
              name={user?.displayName?.replace(/\s*\(.*?\)\s*/g, '')} 
              rounded="full"
              size="xs"
              src={user?.imgUrl} />
            New {t('audit')}
          </Flex>
          <Flex alignItems="center" data-id="030925-ffc57d">
            <Close
              cursor="pointer"
              data-id="030925-30cd5b"
              h="15px"
              onClick={closeModal}
              stroke="auditModal.closeIcon"
              w="15px" />
          </Flex>
        </Flex>
      </ModalHeader>
      <ModalBody data-id="030925-3ebba3" overflowY="auto" p="1rem 0 0 0">
        <Stack data-id="030925-e069ca" justify="space-between" spacing={2}>
          <Stack
            data-id="030925-514a7d"
            flexGrow={1}
            justify="space-between"
            overflowY="auto"
            px={2}
            py={0}
            spacing={6}>
            <Flex data-id="030925-8544f4" direction="column">
              <Text data-id="030925-7fea7e" fontSize="smm" fontWeight="semibold">
                Details
              </Text>
              <Grid
                columnGap={4}
                data-id="030925-45c00d"
                rowGap={2}
                templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']}>
                  <GridItem data-id="030925-a96fac" w="100%">
                    <Dropdown
                      control={control}
                      data-id="030925-57e3ea"
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
                  <GridItem data-id="030925-ac557e" w="100%">
                    <Dropdown
                      control={control}
                      data-id="030925-ea7905"
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
                <GridItem data-id="030925-ecabf0" w="100%">
                  <Dropdown
                    control={control}
                    data-id="030925-50a644"
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
                  <GridItem data-id="030925-101588" w="100%">
                    <Dropdown
                      control={control}
                      data-id="030925-53c29f"
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
              data-id="030925-9bec35"
              isUserAllowedToChange
              label="Audited by"
              onChange={selectAuditor}
              selectedParticipant={selectedAuditor} />
            <MultipleParticipantsSelector
              data-id="030925-b7ead4"
              isUserAllowedToChange
              label="Participants"
              onChange={selectParticipants}
              selectedParticipants={selectedParticipants} />
            <Flex
              data-id="030925-6707c1"
              flexBasis="calc(40px + 1rem)"
              flexShrink={0}
              justify="space-between"
              pt={4}
              w="full">
              {data?.audits?.length > 0 && (
                <Alert data-id="030925-c8a36b" status="warning">
                  <Text as="h3" data-id="030925-939075">
                    {data?.audits?.[0].auditType.name} for {data?.audits?.[0].businessUnit.name} for {format(new Date(), 'MMMM Y')} already{' '}
                    <Text
                      _hover={{
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                      as="span"
                      color="auditModal.existentAuditLink.color"
                      data-id="030925-471e58"
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
      <ModalFooter data-id="030925-e6b9fb" p={1}>
        <Button
          bg="auditModal.tabs.bottomButton.bg"
          color="auditModal.tabs.bottomButton.color"
          data-id="030925-316fa6"
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
          bg="auditModal.tabs.bottomButton.bg"
          color="auditModal.tabs.bottomButton.color"
          data-id="030925-d949bc"
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
            as={TickIcon}
            data-id="030925-4e11d5"
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
