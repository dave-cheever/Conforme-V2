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
  const { user } = useAppContext();
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
    setValue('auditorId', user._id);
    setSelectedAuditor(user);
  };

  const selectParticipants = (users: IUser[]) => {
    setValue(
      'participantsIds',
      users.map((user) => user._id),
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
        description: 'You need to create an audit type',
      });
    }

    const { metatags, ...auditValues } = audit;
    const auditId = await saveAudit({ ...auditValues, recurring: auditType.recurring });

    if (auditId) {
      setAdminModalState('closed');
      navigateTo(`/audits/${auditId}`);
    }
  };

  return (
    (<ModalContent
      bg="auditModal.bg"
      data-id="da7a09e0879e"
      h="100%"
      m="0"
      overflow="hidden"
      p={[4, 6]}
      rounded="0">
      <ModalHeader
        alignItems="center"
        data-id="755d0bce1212"
        fontSize="xxl"
        fontWeight="bold"
        p="0">
        <Flex data-id="d60a03058af8" justifyContent="space-between">
          <Flex alignItems="center" data-id="c0056ca79405" fontSize={['14px', '24px']}>
            <Avatar
              data-id="ecc99630896e"
              mr={3}
              name={user?.displayName}
              rounded="full"
              size="xs"
              src={user?.imgUrl} />
            New {t('audit')}
          </Flex>
          <Flex alignItems="center" data-id="000809e5989f">
            <Close
              cursor="pointer"
              data-id="2721da5cb238"
              h="15px"
              onClick={closeModal}
              stroke="auditModal.closeIcon"
              w="15px" />
          </Flex>
        </Flex>
      </ModalHeader>
      <ModalBody data-id="d8d95ff45eb8" overflowY="auto" p="1rem 0 0 0">
        <Stack data-id="d0ad1d52513f" justify="space-between" spacing={2}>
          <Stack
            data-id="bf5f4914e0ca"
            flexGrow={1}
            justify="space-between"
            overflowY="auto"
            px={2}
            py={0}
            spacing={6}>
            <Flex data-id="4476d5c853b2" direction="column">
              <Text data-id="592754eddf43" fontSize="smm" fontWeight="semibold">
                Details
              </Text>
              <Grid
                columnGap={4}
                data-id="46f258c3934d"
                rowGap={2}
                templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']}>
                {auditTypes?.length > 1 && (
                  <GridItem data-id="e39f74c8ee89" w="100%">
                    <Dropdown
                      control={control}
                      data-id="ea42eecee549"
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
                      }} />
                  </GridItem>
                )}
                <GridItem data-id="cd00d4a564da" w="100%">
                  <Dropdown
                    control={control}
                    data-id="c2f11242bcc2"
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

                <GridItem data-id="ed2f960b3d6a" w="100%">
                  <Dropdown
                    control={control}
                    data-id="3fbe58700538"
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
                  <GridItem data-id="cbcfaffab51b" w="100%">
                    <Dropdown
                      control={control}
                      data-id="091697a310b5"
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
              data-id="bbcbb54de2e6"
              isUserAllowedToChange
              label="Audited by"
              onChange={selectAuditor}
              selectedParticipant={selectedAuditor} />
            <MultipleParticipantsSelector
              data-id="33090068b385"
              isUserAllowedToChange
              label="Participants"
              onChange={selectParticipants}
              selectedParticipants={selectedParticipants} />
            <Flex
              data-id="f5cfdee79b9f"
              flexBasis="calc(40px + 1rem)"
              flexShrink={0}
              justify="space-between"
              pt={4}
              w="full">
              {data?.audits?.length > 0 && (
                <Alert data-id="d0b17882edaa" status="warning">
                  <Text as="h3" data-id="144e4aa5ed14">
                    {data?.audits?.[0].auditType.name} for {data?.audits?.[0].businessUnit.name} for {format(new Date(), 'MMMM Y')} already{' '}
                    <Text
                      _hover={{
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                      as="span"
                      color="auditModal.existentAuditLink.color"
                      data-id="0f907946ad48"
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
      <ModalFooter data-id="2671f95864b8" p={1}>
        <Button
          bg="auditModal.tabs.bottomButton.bg"
          color="auditModal.tabs.bottomButton.color"
          data-id="b3179b1d428d"
          disabled={
            !audit.walkType ||
            !audit.locationId ||
            !!(
              audit.auditTypeId &&
              auditTypes.find(({ _id }) => _id === audit.auditTypeId)?.businessUnitScope === 'audit' &&
              !audit.businessUnitId
            )
          }
          fontSize="smm"
          fontWeight="700"
          h="40px"
          minW="inherit"
          ml={3}
          onClick={() => {
            handlePrimaryButtonClick();
          }}
          rightIcon={<Icon
            as={TickIcon}
            data-id="3fb66e812544"
            size={24}
            stroke="auditModal.tabs.bottomButton.icon" />}
          rounded="10px"
          w="max-content">
          Start {t('audit')}
        </Button>
      </ModalFooter>
    </ModalContent>)
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
        bg: '#DC0043',
        color: '#ffffff',
        icon: '#ffffff',
        hover: '#DC0043',
      },
    },
  },
};
