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

const AuditHeader = () => {
  const { user } = useAppContext();
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

  const DeleteButton = () =>
    isPermitted({ user, action: 'audits.delete' }) ? (
      <AuditHeaderButton
        bgColor="transparent"
        data-id="c14d64ff45ff"
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

  const RecurringButton = () =>
    audit?.walkType === 'physical' && isPermitted({ user, action: 'audits.changeRecurring' }) ? (
      <AuditHeaderButton
        bgColor="transparent"
        data-id="374301477b74"
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

  const SubmitButton = () => {
    if (audit.status === 'upcoming' && isPermitted({ user, action: 'audits.edit', data: { audit } })) {
      return (
        (<AuditHeaderButton
          bgColor="#DC0043"
          data-id="174da23dafba"
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
          } />)
      );
    }
    return null;
  };

  const AuditShareButton = () => (
    <ShareButton
      ariaLabel="audit-share-button"
      data-id="7f75968e37b5"
      ml={['auto', '24px']}
      mr="auto"
      onClick={() => {
        setShareItemUrl(`audits/${audit?._id}`);
        setShareItemName(businessUnit?.name || location?.name || '');
        handleShareOpen();
      }} />
  );

  return (<>
    <AuditSubmitModal
      data-id="36bb16b91bfc"
      isOpen={isSubmitModalOpen}
      onClose={() => {
        handleSubmitModalClose();
      }} />
    <AuditDeletModal
      data-id="f9f2000498b0"
      isOpen={isDeleteModalOpen}
      onClose={() => {
        handleDeleteModalClose();
      }} />
    <AuditRecurringModal
      data-id="0c27cd9cd349"
      isOpen={isRecurringModalOpen}
      onClose={() => {
        handleRecurringModalClose();
      }} />
    <Flex
      bg="auditHeader.bg"
      data-id="70735d6970da"
      direction="column"
      mb="15px"
      pl={6}
      w="full"
      zIndex={1}>
      <Stack
        align={['flex-start', 'center']}
        data-id="167b013215d1"
        direction={['column', 'row']}
        h={['auto', '40px']}
        mb="15px"
        spacing={4}
        w="full">
        <Heading
          alignItems={['flex-start', 'center']}
          color="auditHeader.heading"
          data-id="533f5a888af7"
          fontSize="xxl"
          fontWeight="bold">
          <HStack data-id="9b7be6440785" justify="center">
            <Avatar
              data-id="3727b4af4ef6"
              name={auditor?.displayName}
              rounded="full"
              size="xs"
              src={auditor?.imgUrl} />
            <Text data-id="4736df88e6b4">{`${audit?.auditor?.displayName} - ${audit?.reference}`}</Text>
          </HStack>
        </Heading>
        {audit.status === 'completed' && (
          <Badge
            colorScheme="green"
            data-id="22dbb17c7136"
            h="fit-content"
            variant="outline">
            Completed
          </Badge>
        )}
        {audit.status === 'missed' && (
          <Badge
            colorScheme="red"
            data-id="5956da468773"
            h="fit-content"
            variant="outline">
            Missed
          </Badge>
        )}
      </Stack>
      <Flex data-id="18708d7aa951" pr="25px">
        <Stack data-id="3e76045ca82c" direction={['column', 'row']} spacing={[3, 6]}>
          <Flex data-id="bce4726db370" direction="column" justify="center">
            <Text data-id="08c671d75912" fontSize="11px" opacity={0.5}>
              Item ID
            </Text>
            <Text data-id="9be7f9c82ab2" fontSize="smm">{audit?.reference}</Text>
          </Flex>
          {audit?.walkType === 'physical' && (
            <Flex
              data-id="0478c022581f"
              direction="column"
              justify="center"
              wordBreak="break-all">
              <Text data-id="3bdcdfdb4200" fontSize="11px" opacity={0.5}>
                {capitalize(t('location'))}
              </Text>
              <Tooltip data-id="2b3df963e728" label={location?.name}>
                <Text data-id="b2ece6ab80fb" fontSize="smm" noOfLines={2}>
                  {location?.name}
                </Text>
              </Tooltip>
            </Flex>
          )}
          {audit?.businessUnit && (
            <Flex
              data-id="e8c1f1fcf136"
              direction="column"
              justify="center"
              wordBreak="break-all">
              <Text data-id="d44d77bc1f07" fontSize="11px" opacity={0.5}>
                {capitalize(t('business unit'))}
              </Text>
              <Tooltip data-id="67c9402c7251" label={businessUnit?.name}>
                <Text data-id="619b97e2c131" fontSize="smm" noOfLines={2}>
                  {businessUnit?.name}
                </Text>
              </Tooltip>
            </Flex>
          )}
          <Flex data-id="5e783ba7be41" direction="column" justify="center">
            <Text data-id="b28b0b0978ff" fontSize="11px" opacity={0.5}>
              Type
            </Text>
            <Text data-id="40cf3410e579" fontSize="smm" textTransform="capitalize">
              {audit?.walkType}
            </Text>
          </Flex>
        </Stack>
        <Spacer data-id="770633f3daec" />
        <Stack
          data-id="06e72dc3e24f"
          direction="row"
          display={['none', 'flex']}
          spacing={[3, 6]}>
          <AuditShareButton data-id="4203886d17bf" />
          {isPermitted({ user, action: 'audits.delete', data: { audit } }) && (
            <>
              <DeleteButton data-id="a9aa362ecc86" />
              {audit?.walkType === 'physical' && <RecurringButton data-id="2fed6fa2ee6a" />}
            </>
          )}
          <SubmitButton data-id="a2c29e2ce909" />
        </Stack>
      </Flex>

      <Flex
        alignItems="center"
        data-id="2b937641b1e6"
        display={['flex', 'none']}
        h="40px"
        mr="25px"
        mt={4}>
        <Menu data-id="0ba53e2554fe">
          {({ isOpen }) => (
            <>
              <MenuButton
                as={Button}
                bg={isOpen ? 'reasponseHeader.optionsMenuBgOpen' : 'reasponseHeader.optionsMenuBg'}
                borderRadius="10px"
                color="reasponseHeader.optionsMenuButtonColor"
                colorScheme="reasponseHeader.optionsMenuColorScheme"
                data-id="99e4c11de228"
                fontFamily="Helvetica"
                fontSize="smm"
                fontWeight="bold"
                isActive={isOpen}
                lineHeight="18px"
                rightIcon={<ArrowDownIcon data-id="75014e6a993d" />}
                textAlign="left"
                w="full">
                Options
              </MenuButton>
              <MenuList
                borderColor="reasponseHeader.optionsMenuBorderColor"
                borderRadius="10px"
                boxShadow="0px 0px 80px"
                color="reasponseHeader.optionsMenuBoxShadow"
                data-id="674f4a0c5269"
                minW={['calc(100vw - 50px)', '325px']}
                w="100%"
                zIndex="10">
                <AuditShareButton data-id="f83784dadb02" />
                <DeleteButton data-id="b7a0af37ebd7" />
                <RecurringButton data-id="de80a7578f97" />
                <SubmitButton data-id="10cc8844cca4" />
              </MenuList>
            </>
          )}
        </Menu>
      </Flex>
    </Flex>
  </>);
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
