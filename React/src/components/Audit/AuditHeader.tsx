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
      data-id="030925-1a1bbd"
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
      data-id="030925-407bb1"
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
          data-id="030925-71d59a"
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
      data-id="030925-476e98"
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
        data-id="030925-eddbeb"
        isOpen={isSubmitModalOpen}
        onClose={() => {
          handleSubmitModalClose();
        }} />
      <AuditDeletModal
        data-id="030925-4ab35c"
        isOpen={isDeleteModalOpen}
        onClose={() => {
          handleDeleteModalClose();
        }} />
      <AuditRecurringModal
        data-id="030925-5ae262"
        isOpen={isRecurringModalOpen}
        onClose={() => {
          handleRecurringModalClose();
        }} />
      <Flex
        data-id="030925-d93b55"
        direction="column"
        mb="15px"
        pl={6}
        pt={4}
        w="full"
        zIndex={1}>
        <Stack
          data-id="030925-b03b60"
          align={['flex-start', 'center']}
          direction={['column', 'row']}
          h={['auto', '40px']}
          mb="15px"
          spacing={4}
          w="full">
          <Heading
            data-id="030925-5584c9"
            alignItems={['flex-start', 'center']}
            color="auditHeader.heading"
            fontSize={["24px", "xxl"]}
            fontWeight="bold">
            <HStack data-id="030925-1fba5b" justify="center">
              <Avatar
                data-id="030925-fc9ca1"
                name={auditor?.displayName?.replace(/\s*\(.*?\)\s*/g, '')}
                rounded="full"
                size="xs"
                src={auditor?.imgUrl} />
              <Text data-id="030925-dc88ea">{`${audit?.auditor?.displayName} - ${audit?.reference}`}</Text>
            </HStack>
          </Heading>
          {audit.status === 'completed' && (
            <Badge
              data-id="030925-017a12"
              colorScheme="green"
              fontSize="16px"
              h="fit-content"
              variant="outline">
              Completed
            </Badge>
          )}
          {audit.status === 'missed' && (
            <Badge
              data-id="030925-af89b8"
              colorScheme="red"
              fontSize="16px"
              h="fit-content"
              variant="outline">
              Missed
            </Badge>
          )}
        </Stack>
        <Flex data-id="030925-101793" pr="25px">
          <Stack data-id="030925-6b60b5" direction={['column', 'row']} spacing={[3, 6]}>
            <Flex data-id="030925-7fc8cb" direction="column" justify="center">
              <Text data-id="030925-4692fa" fontSize={["12px", "11px"]} opacity={0.5}>
                Item ID
              </Text>
              <Text data-id="030925-704109" fontSize="smm">{audit?.reference}</Text>
            </Flex>
            {audit?.walkType === 'physical' && (
              <Flex
                data-id="030925-43463d"
                direction="column"
                justify="center"
                wordBreak="break-all">
                <Text data-id="030925-170e79" fontSize={["12px", "11px"]}  opacity={0.5}>
                  {capitalize(t('location'))}
                </Text>
                <Tooltip data-id="030925-ff8d42" label={location?.name}>
                  <Text data-id="030925-1d284a" fontSize="smm" noOfLines={2}>
                    {location?.name}
                  </Text>
                </Tooltip>
              </Flex>
            )}
            {audit?.businessUnit && (
              <Flex
                data-id="030925-bd4be4"
                direction="column"
                justify="center"
                wordBreak="break-all">
                <Text data-id="030925-416159" fontSize={["12px", "11px"]}  opacity={0.5}>
                  {capitalize(t('business unit'))}
                </Text>
                <Tooltip data-id="030925-19ec90" label={businessUnit?.name}>
                  <Text data-id="030925-fb4f21" fontSize="smm" noOfLines={2}>
                    {businessUnit?.name}
                  </Text>
                </Tooltip>
              </Flex>
            )}
            {module?.featureFlags?.enableSafetyWalk && 
              <Flex data-id="030925-ef96bc" direction="column" justify="center">
                <Text data-id="030925-775397" fontSize={["12px", "11px"]}  opacity={0.5}>
                  Type
                </Text>
                <Text data-id="030925-e22f1f" fontSize="smm" textTransform="capitalize">
                  {audit?.walkType}
                </Text>
              </Flex>
            }
          </Stack>
          <Spacer data-id="030925-b54c53" />
          <Stack
            data-id="030925-c4be76"
            direction="row"
            display={['none', 'flex']}
            spacing={[3, 6]}>
            <AuditShareButton
              data-id="030925-616814"
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
                  data-id="030925-04e878"
                  handleActionChangesModalOpen={handleActionChangesModalOpen}
                  handleDeleteModalOpen={handleDeleteModalOpen}
                  onDeleteAudit={onDeleteAudit}
                  selectedAction={selectedAction}
                  setActionChangesModalOnContinue={setActionChangesModalOnContinue}
                  user={user}
                />
                {audit?.walkType === 'physical' && <RecurringButton
                  data-id="030925-f7c9ad"
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
              data-id="030925-1078f6"
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
          data-id="030925-2e573f"
          alignItems="center"
          display={['flex', 'none']}
          h="40px"
          mr="25px"
          mt={4}>
          <Menu data-id="030925-1c3e5c">
            {({ isOpen }) => (
              <>
                <MenuButton
                  data-id="030925-2c39f5"
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
                  rightIcon={<ArrowDownIcon data-id="030925-052636" />}
                  textAlign="left"
                  w="full">
                  Options
                </MenuButton>
                <MenuList
                  data-id="030925-eadbdb"
                  borderColor="reasponseHeader.optionsMenuBorderColor"
                  borderRadius="10px"
                  boxShadow="0px 0px 80px"
                  color="reasponseHeader.optionsMenuBoxShadow"
                  minW={['calc(100vw - 50px)', '325px']}
                  w="100%"
                  zIndex="10">
                  <AuditShareButton
                    data-id="030925-6797c5"
                    audit={audit}
                    businessUnit={businessUnit}
                    handleShareOpen={handleShareOpen}
                    location={location}
                    setShareItemName={setShareItemName}
                    setShareItemUrl={setShareItemUrl}
                  />
                  <DeleteButton
                    data-id="030925-ed83e6"
                    handleActionChangesModalOpen={handleActionChangesModalOpen}
                    handleDeleteModalOpen={handleDeleteModalOpen}
                    onDeleteAudit={onDeleteAudit}
                    selectedAction={selectedAction}
                    setActionChangesModalOnContinue={setActionChangesModalOnContinue}
                    user={user}
                  />
                  <RecurringButton
                    data-id="030925-fa505e"
                    audit={audit}
                    handleActionChangesModalOpen={handleActionChangesModalOpen}
                    handleRecurringModalOpen={handleRecurringModalOpen}
                    selectedAction={selectedAction}
                    setActionChangesModalOnContinue={setActionChangesModalOnContinue}
                    user={user}
                  />
                  <SubmitButton
                    data-id="030925-adea20"
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
