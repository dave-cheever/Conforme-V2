import {
  Avatar,
  Badge,
  Button,
  Flex,
  Heading,
  HStack,
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
import { useShareContext } from '../../contexts/ShareProvider';
import useNavigate from '../../hooks/useNavigate';
import { ArrowDownIcon } from '../../icons';
import { isPermitted } from '../can';
import ShareButton from '../ShareButton';
import AuditDeletModal from './AuditDeleteModal';
import AuditHeaderButton from './AuditHeaderButton';
import AuditRecurringModal from './AuditRecurringModal';
import AuditSubmitModal from './AuditSubmitModal';

function DeleteButton({
  user,
  selectedAction,
  setActionChangesModalOnContinue,
  onDeleteAudit,
  handleActionChangesModalOpen,
  handleDeleteModalOpen,
}) {
  return isPermitted({ user, action: 'audits.delete' }) ? (
    <AuditHeaderButton
      data-id="000122"
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
      } />
  ) : null;
}

function RecurringButton({
  user,
  audit,
  selectedAction,
  setActionChangesModalOnContinue,
  handleActionChangesModalOpen,
  handleRecurringModalOpen,
}) {
  return audit?.walkType === 'physical' && isPermitted({ user, action: 'audits.changeRecurring' }) ? (
    <AuditHeaderButton
      data-id="000123"
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
      } />
  ) : null;
}

function SubmitButton({
  audit,
  user,
  questions,
  selectedAction,
  setActionChangesModalOnContinue,
  onSubmitAudit,
  handleActionChangesModalOpen,
  handleSubmitModalOpen,
}) {
  if (audit.status === 'upcoming' && isPermitted({ user, action: 'audits.edit', data: { audit } })) {
    return (
      <AuditHeaderButton
          data-id="000124"
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
          } />
    );
  }
  return null;
}

function AuditShareButton({
  audit,
  businessUnit,
  location,
  handleShareOpen,
  setShareItemUrl,
  setShareItemName,
}) {
  return (
    <ShareButton
      data-id="000125"
      ariaLabel="audit-share-button"
      ml={['auto', '24px']}
      mr="auto"
      onClick={() => {
        setShareItemUrl(`audits/${audit?._id}`);
        setShareItemName(businessUnit?.name || location?.name || '');
        handleShareOpen();
      }} />
  );
}

function AuditHeader() {
  const { module, user } = useAppContext();
  const { handleShareOpen, setShareItemUrl, setShareItemName } = useShareContext();
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

  return (
    <>
      <AuditSubmitModal
        data-id="000126"
        isOpen={isSubmitModalOpen}
        onClose={() => {
          handleSubmitModalClose();
        }} />
      <AuditDeletModal
        data-id="000127"
        isOpen={isDeleteModalOpen}
        onClose={() => {
          handleDeleteModalClose();
        }} />
      <AuditRecurringModal
        data-id="000128"
        isOpen={isRecurringModalOpen}
        onClose={() => {
          handleRecurringModalClose();
        }} />
      <Flex
        data-id="000129"
        direction="column"
        mb="15px"
        pl={6}
        pt={4}
        w="full"
        zIndex={1}>
        <Stack
          data-id="000130"
          align={['flex-start', 'center']}
          direction={['column', 'row']}
          h={['auto', '40px']}
          mb="15px"
          spacing={4}
          w="full">
          <Heading
            data-id="000131"
            alignItems={['flex-start', 'center']}
            color="auditHeader.heading"
            fontSize={["24px", "xxl"]}
            fontWeight="bold">
            <HStack data-id="000132" justify="center">
              <Avatar
                data-id="000133"
                name={auditor?.displayName?.replace(/\s*\(.*?\)\s*/g, '')}
                rounded="full"
                size="xs"
                src={auditor?.imgUrl} />
              <Text data-id="000134">{`${audit?.auditor?.displayName} - ${audit?.reference}`}</Text>
            </HStack>
          </Heading>
          {audit.status === 'completed' && (
            <Badge
              data-id="000135"
              colorScheme="green"
              fontSize="16px"
              h="fit-content"
              variant="outline">
              Completed
            </Badge>
          )}
          {audit.status === 'missed' && (
            <Badge
              data-id="000136"
              colorScheme="red"
              fontSize="16px"
              h="fit-content"
              variant="outline">
              Missed
            </Badge>
          )}
        </Stack>
        <Flex data-id="000137" pr="25px">
          <Stack data-id="000138" direction={['column', 'row']} spacing={[3, 6]}>
            <Flex data-id="000139" direction="column" justify="center">
              <Text data-id="000140" fontSize={["12px", "11px"]} opacity={0.5}>
                Item ID
              </Text>
              <Text data-id="000141" fontSize="smm">{audit?.reference}</Text>
            </Flex>
            {audit?.walkType === 'physical' && (
              <Flex
                data-id="000142"
                direction="column"
                justify="center"
                wordBreak="break-all">
                <Text data-id="000143" fontSize={["12px", "11px"]}  opacity={0.5}>
                  {capitalize(t('location'))}
                </Text>
                <Tooltip data-id="000144" label={location?.name}>
                  <Text data-id="000145" fontSize="smm" noOfLines={2}>
                    {location?.name}
                  </Text>
                </Tooltip>
              </Flex>
            )}
            {audit?.businessUnit && (
              <Flex
                data-id="000146"
                direction="column"
                justify="center"
                wordBreak="break-all">
                <Text data-id="000147" fontSize={["12px", "11px"]}  opacity={0.5}>
                  {capitalize(t('business unit'))}
                </Text>
                <Tooltip data-id="000148" label={businessUnit?.name}>
                  <Text data-id="000149" fontSize="smm" noOfLines={2}>
                    {businessUnit?.name}
                  </Text>
                </Tooltip>
              </Flex>
            )}
            {module?.featureFlags?.enableSafetyWalk && 
              <Flex data-id="000150" direction="column" justify="center">
                <Text data-id="000151" fontSize={["12px", "11px"]}  opacity={0.5}>
                  Type
                </Text>
                <Text data-id="000152" fontSize="smm" textTransform="capitalize">
                  {audit?.walkType}
                </Text>
              </Flex>
            }
          </Stack>
          <Spacer data-id="000153" />
          <Stack
            data-id="000154"
            direction="row"
            display={['none', 'flex']}
            spacing={[3, 6]}>
            <AuditShareButton
              data-id="000155"
              audit={audit}
              businessUnit={businessUnit}
              handleShareOpen={handleShareOpen}
              location={location}
              setShareItemName={setShareItemName}
              setShareItemUrl={setShareItemUrl}
            />
            {isPermitted({ user, action: 'audits.delete', data: { audit } }) && (
              <>
                <DeleteButton
                  data-id="000156"
                  handleActionChangesModalOpen={handleActionChangesModalOpen}
                  handleDeleteModalOpen={handleDeleteModalOpen}
                  onDeleteAudit={onDeleteAudit}
                  selectedAction={selectedAction}
                  setActionChangesModalOnContinue={setActionChangesModalOnContinue}
                  user={user}
                />
                {audit?.walkType === 'physical' && <RecurringButton
                  data-id="000157"
                  audit={audit}
                  handleActionChangesModalOpen={handleActionChangesModalOpen}
                  handleRecurringModalOpen={handleRecurringModalOpen}
                  selectedAction={selectedAction}
                  setActionChangesModalOnContinue={setActionChangesModalOnContinue}
                  user={user}
                />}
              </>
            )}
            <SubmitButton
              data-id="000158"
              audit={audit}
              handleActionChangesModalOpen={handleActionChangesModalOpen}
              handleSubmitModalOpen={handleSubmitModalOpen}
              onSubmitAudit={onSubmitAudit}
              questions={questions}
              selectedAction={selectedAction}
              setActionChangesModalOnContinue={setActionChangesModalOnContinue}
              user={user}
            />
          </Stack>
        </Flex>

        <Flex
          data-id="000159"
          alignItems="center"
          display={['flex', 'none']}
          h="40px"
          mr="25px"
          mt={4}>
          <Menu data-id="000160">
            {({ isOpen }) => (
              <>
                <MenuButton
                  data-id="000161"
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
                  rightIcon={<ArrowDownIcon data-id="000162" />}
                  textAlign="left"
                  w="full">
                  Options
                </MenuButton>
                <MenuList
                  data-id="000163"
                  borderColor="reasponseHeader.optionsMenuBorderColor"
                  borderRadius="10px"
                  boxShadow="0px 0px 80px"
                  color="reasponseHeader.optionsMenuBoxShadow"
                  minW={['calc(100vw - 50px)', '325px']}
                  w="100%"
                  zIndex="10">
                  <AuditShareButton
                    data-id="000164"
                    audit={audit}
                    businessUnit={businessUnit}
                    handleShareOpen={handleShareOpen}
                    location={location}
                    setShareItemName={setShareItemName}
                    setShareItemUrl={setShareItemUrl}
                  />
                  <DeleteButton
                    data-id="000165"
                    handleActionChangesModalOpen={handleActionChangesModalOpen}
                    handleDeleteModalOpen={handleDeleteModalOpen}
                    onDeleteAudit={onDeleteAudit}
                    selectedAction={selectedAction}
                    setActionChangesModalOnContinue={setActionChangesModalOnContinue}
                    user={user}
                  />
                  <RecurringButton
                    data-id="000166"
                    audit={audit}
                    handleActionChangesModalOpen={handleActionChangesModalOpen}
                    handleRecurringModalOpen={handleRecurringModalOpen}
                    selectedAction={selectedAction}
                    setActionChangesModalOnContinue={setActionChangesModalOnContinue}
                    user={user}
                  />
                  <SubmitButton
                    data-id="000167"
                    audit={audit}
                    handleActionChangesModalOpen={handleActionChangesModalOpen}
                    handleSubmitModalOpen={handleSubmitModalOpen}
                    onSubmitAudit={onSubmitAudit}
                    questions={questions}
                    selectedAction={selectedAction}
                    setActionChangesModalOnContinue={setActionChangesModalOnContinue}
                    user={user}
                  />
                </MenuList>
              </>
            )}
          </Menu>
        </Flex>
      </Flex>
    </>
  );
}

export default AuditHeader;

export const auditHeaderStyles = {
  auditHeader: {
    bg: '#f5f5f5',
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
