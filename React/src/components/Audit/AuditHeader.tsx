import { Avatar, Badge, Box, Flex, Heading, Spacer, Stack, Text, useDisclosure, useToast } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';

import { toastSuccess } from '../../bootstrap/config';
import { useAppContext } from '../../contexts/AppProvider';
import { useAuditContext } from '../../contexts/AuditProvider';
import { isPermitted } from '../can';
import AuditHeaderButton from './AuditHeaderButton';
import AuditSubmitModal from './AuditSubmitModal';

const AuditHeader = () => {
  const { user } = useAppContext();
  const toast = useToast();
  const {
    audit,
    auditor,
    site,
    area,
    selectedAction,
    questions,
    submitAudit,
    refetch,
    handleActionChangesModalOpen,
    setActionChangesModalOnContinue,
  } = useAuditContext();
  const { isOpen: isSubmitModalOpen, onOpen: handleSubmitModalOpen, onClose: handleSubmitModalClose } = useDisclosure();
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

  return (
    <>
      <AuditSubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => {
          handleSubmitModalClose();
        }}
      />
      <Flex bg="auditHeader.bg" direction="column" mb="15px" pl={6} w="full" zIndex={1}>
        <Stack align={['flex-start', 'center']} direction={['column', 'row']} h={['auto', '40px']} mb="15px" spacing={4} w="full">
          <Heading alignItems={['flex-start', 'center']} color="auditHeader.heading" fontSize="xxl" fontWeight="bold">
            {area?.name ?? 'Virtual'}
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
              <Flex direction="column" justify="center">
                <Text fontSize="11px" opacity={0.5}>
                  Site
                </Text>
                <Text fontSize="smm">{site?.name}</Text>
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

          {/* heere */}
          {audit.status === 'upcoming' && isPermitted({ user, action: 'audits.edit', data: { audit } }) && (
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
          )}
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
