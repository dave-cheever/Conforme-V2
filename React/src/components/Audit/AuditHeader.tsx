import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  Spacer,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';

import { toastSuccess } from '../../bootstrap/config';
import { useAppContext } from '../../contexts/AppProvider';
import { useAuditContext } from '../../contexts/AuditProvider';
import useNavigate from '../../hooks/useNavigate';
import { ArrowDownIcon } from '../../icons';
import { isPermitted } from '../can';
import AuditDeletModal from './AuditDeleteModal';
import AuditHeaderButton from './AuditHeaderButton';
import AuditRecurringModal from './AuditRecurringModal';
import AuditSubmitModal from './AuditSubmitModal';

const AuditHeader = () => {
  const { user } = useAppContext();
  const toast = useToast();
  const {
    audit,
    auditor,
    location,
    businessUnit,
    selectedAction,
    questions,
    deleteAudit,
    submitAudit,
    refetch,
    handleActionChangesModalOpen,
    setActionChangesModalOnContinue,
  } = useAuditContext();
  const { isOpen: isSubmitModalOpen, onOpen: handleSubmitModalOpen, onClose: handleSubmitModalClose } = useDisclosure();
  const { isOpen: isRecurringModalOpen, onOpen: handleRecurringModalOpen, onClose: handleRecurringModalClose } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: handleDeleteModalOpen, onClose: handleDeleteModalClose } = useDisclosure();
  const { navigateTo } = useNavigate();

  if (!audit) return null;

  const onSubmitAudit = async () => {
    await submitAudit({
      variables: {
        auditId: audit._id,
      },
    });
    refetch();
    toast({
      ...toastSuccess,
      description: `${capitalize(t('audit'))} completed`,
    });
  };

  const onDeleteAudit = async () => {
    await deleteAudit({
      variables: {
        _id: audit._id,
      },
    });
    navigateTo('/audits');
    refetch();
    toast({
      ...toastSuccess,
      description: `${capitalize(t('audit'))} deleted`,
    });
  };

  const DeleteButton = () =>
    isPermitted({ user, action: 'audits.admin' }) ? (
      <AuditHeaderButton
        bgColor="transparent"
        fontColor="#DC0043"
        icon={null}
        name="Delete"
        onClick={
          selectedAction
            ? () => {
                setActionChangesModalOnContinue(() => onDeleteAudit);
                handleActionChangesModalOpen();
              }
            : handleDeleteModalOpen
        }
      />
    ) : null;

  const RecurringButton = () =>
    audit?.walkType === 'physical' && isPermitted({ user, action: 'audits.admin' }) ? (
      <AuditHeaderButton
        bgColor="transparent"
        fontColor="#DC0043"
        icon={null}
        name={`Change to ${audit.recurring ? 'non' : ''}recurring`}
        onClick={
          selectedAction
            ? () => {
                setActionChangesModalOnContinue(() => handleRecurringModalOpen);
                handleActionChangesModalOpen();
              }
            : handleRecurringModalOpen
        }
      />
    ) : null;

  const SubmitButton = () => {
    if (audit.status === 'upcoming' && isPermitted({ user, action: 'audits.edit', data: { audit } })) {
      return (
        <AuditHeaderButton
          bgColor="#DC0043"
          disabled={!questions || Object.keys(questions).length === 0}
          fontColor="white"
          icon={null}
          name="Submit"
          onClick={
            selectedAction
              ? () => {
                  setActionChangesModalOnContinue(() => onSubmitAudit);
                  handleActionChangesModalOpen();
                }
              : handleSubmitModalOpen
          }
        />
      );
    }
    return null;
  };

  return (
    <>
      <AuditSubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => {
          handleSubmitModalClose();
        }}
      />
      <AuditDeletModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          handleDeleteModalClose();
        }}
      />
      <AuditRecurringModal
        isOpen={isRecurringModalOpen}
        onClose={() => {
          handleRecurringModalClose();
        }}
      />
      <Flex bg="auditHeader.bg" direction="column" mb="15px" pl={6} w="full" zIndex={1}>
        <Stack align={['flex-start', 'center']} direction={['column', 'row']} h={['auto', '40px']} mb="15px" spacing={4} w="full">
          <Heading alignItems={['flex-start', 'center']} color="auditHeader.heading" fontSize="xxl" fontWeight="bold">
            {businessUnit?.name ?? 'Virtual'}
          </Heading>
          {audit.status === 'completed' && (
            <Badge colorScheme="green" h="fit-content" variant="outline">
              Completed
            </Badge>
          )}
          {audit.status === 'missed' && (
            <Badge colorScheme="red" h="fit-content" variant="outline">
              Missed
            </Badge>
          )}
        </Stack>
        <Flex pr="25px">
          <Stack direction={['column', 'row']} spacing={[3, 6]}>
            <Flex direction="column" justify="center">
              <Text fontSize="11px" opacity={0.5}>
                Item ID
              </Text>
              <Text fontSize="smm">{audit?.reference}</Text>
            </Flex>
            <Stack align="center" direction="row" spacing={2}>
              <Avatar name={auditor?.displayName} rounded="full" size="xs" src={auditor?.imgUrl} />
              <Box>
                <Text fontSize="11px" opacity={0.5}>
                  Owner
                </Text>
                <Text fontSize="smm">{auditor?.displayName}</Text>
              </Box>
            </Stack>
            {audit?.walkType === 'physical' && (
              <Flex direction="column" justify="center" wordBreak="break-all">
                <Text fontSize="11px" opacity={0.5}>
                  {capitalize(t('location'))}
                </Text>
                <Tooltip label={location?.name}>
                  <Text fontSize="smm" noOfLines={2}>
                    {location?.name}
                  </Text>
                </Tooltip>
              </Flex>
            )}
            <Flex direction="column" justify="center">
              <Text fontSize="11px" opacity={0.5}>
                Type
              </Text>
              <Text fontSize="smm" textTransform="capitalize">
                {audit?.walkType}
              </Text>
            </Flex>
          </Stack>
          <Spacer />
          {/**
           * Hidden for now according to feature 44736
           * TODO: Show "Share" button
           */}
          {/* <AuditHeaderButton
            icon={
              <ShareIcon
                _groupHover={{
                  stroke: 'auditHeader.buttonLightColorHover',
                }}
                fontSize="15px"
                stroke="auditHeader.buttonLightColor"
              />
            }
            name="Share"
            onClick={() => {}}
          /> */}
          <Stack direction="row" display={['none', 'flex']} spacing={[3, 6]}>
            <DeleteButton />
            <RecurringButton />
            <SubmitButton />
          </Stack>
        </Flex>

        <Flex alignItems="center" display={['flex', 'none']} h="40px" mr="25px" mt={4}>
          <Menu>
            {({ isOpen }) => (
              <>
                <MenuButton
                  as={Button}
                  bg={isOpen ? 'reasponseHeader.optionsMenuBgOpen' : 'reasponseHeader.optionsMenuBg'}
                  borderRadius="10px"
                  color="reasponseHeader.optionsMenuButtonColor"
                  colorScheme="reasponseHeader.optionsMenuColorScheme"
                  fontFamily="Helvetica"
                  fontSize="smm"
                  fontWeight="bold"
                  isActive={isOpen}
                  lineHeight="18px"
                  rightIcon={<ArrowDownIcon />}
                  textAlign="left"
                  w="full"
                >
                  Options
                </MenuButton>
                <MenuList
                  borderColor="reasponseHeader.optionsMenuBorderColor"
                  borderRadius="10px"
                  boxShadow="0px 0px 80px"
                  color="reasponseHeader.optionsMenuBoxShadow"
                  minW={['calc(100vw - 50px)', '325px']}
                  w="100%"
                  zIndex="10"
                >
                  <DeleteButton />
                  <RecurringButton />
                  <SubmitButton />
                </MenuList>
              </>
            )}
          </Menu>
        </Flex>
      </Flex>
    </>
  );
};

export default AuditHeader;

export const auditHeaderStyles = {
  auditHeader: {
    bg: '#E5E5E5',
    heading: '#282F36',
    badge: '#FF9A00',
    badgeBg: 'rgba(255, 154, 0, 0.1)',
    badgeColorScheme: 'orange',
    buttonDarkBg: '#818197',
    buttonDarkColor: '#FFFFFF',
    buttonDarkBgHover: '#FFFFFF',
    buttonDarkColorHover: '#818197',
    buttonLightBg: '#FFFFFF',
    buttonLightColor: '#818197',
    buttonLightBgHover: '#818197',
    buttonLightColorHover: '#FFFFFF',
    snapshot: {
      color: '#ff7000',
    },
  },
};
