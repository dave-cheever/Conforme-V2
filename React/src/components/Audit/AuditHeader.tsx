import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';

import { toastSuccess } from '../../bootstrap/config';
import { useAppContext } from '../../contexts/AppProvider';
import { useAuditContext } from '../../contexts/AuditProvider';
import { ArrowDownIcon } from '../../icons';
import { isPermitted } from '../can';
import AuditHeaderButton from './AuditHeaderButton';
import AuditSubmitModal from './AuditSubmitModal';

const AuditHeader = () => {
  const toast = useToast();
  const { user } = useAppContext();
  const { audit, auditor, site, area } = useAuditContext();
  const { isOpen: isSubmitModalOpen, onOpen: handleSubmitModalOpen, onClose: handleSubmitModalClose } = useDisclosure();

  if (!audit) return null;

  return (
    <>
      <AuditSubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => {
          handleSubmitModalClose();
          toast({
            ...toastSuccess,
            description: `${capitalize(t('audit'))} completed`,
          });
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
          {audit.status === 'upcoming' && isPermitted({ user, action: 'audits.edit', data: { audit } }) && (
            <AuditHeaderButton bgColor="#DC0043" fontColor="white" icon={null} name="Submit" onClick={handleSubmitModalOpen} />
          )}
        </Flex>
        {audit.status === 'upcoming' && isPermitted({ user, action: 'audits.edit', data: { audit } }) && (
          <Flex alignItems="center" display={['flex', 'none']} h="40px" mr="25px" mt={4}>
            <Menu>
              {({ isOpen }) => (
                <>
                  <MenuButton
                    as={Button}
                    bg={isOpen ? 'auditHeader.optionsMenuBgOpen' : 'auditHeader.optionsMenuBg'}
                    borderRadius="10px"
                    color="auditHeader.optionsMenuButtonColor"
                    colorScheme="auditHeader.optionsMenuColorScheme"
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
                    borderColor="auditHeader.optionsMenuBorderColor"
                    borderRadius="10px"
                    boxShadow="0px 0px 80px"
                    color="auditHeader.optionsMenuBoxShadow"
                    minW={['calc(100vw - 50px)', '325px']}
                    w="100%"
                  >
                    {/**
                     * Hidden for now according to feature 44736
                     * TODO: Show "Share" button
                     */}
                    {/* <AuditHeaderMenuItem
                    icon={
                      <ShareIcon
                        _groupHover={{
                          stroke: 'auditHeader.buttonLightColorHover',
                        }}
                        fontSize="15px"
                        stroke="auditHeader.buttonLightColor"
                      />
                    }
                    onClick={() => {}}
                    title="Share"
                  /> */}
                    <MenuItem color="auditHeadeMenuItem.optionsMenuColor" onClick={handleSubmitModalOpen} w="100%">
                      <Box p="2">Submit</Box>
                    </MenuItem>
                  </MenuList>
                </>
              )}
            </Menu>
          </Flex>
        )}
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
    optionsMenuColorScheme: '#818197',
    optionsMenuBg: '#818197',
    optionsMenuBgOpen: '#282F36',
    optionsMenuButtonColor: '#FFFFFF',
    optionsMenuBorderColor: '#FFFFFF',
    optionsMenuDivider: '#F0F0F0',
    optionsMenuBoxShadow: 'rgba(49, 50, 51, 0.25)',
    optionsMenuColor: '#818197',
    snapshot: {
      color: '#ff7000',
    },
  },
};
