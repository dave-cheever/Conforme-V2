import { useContext, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { SmallCloseIcon, WarningTwoIcon } from '@chakra-ui/icons';
import {
  Badge,
  Button,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuDivider,
  MenuList,
  Spacer,
  Stack,
  Text,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import format from 'date-fns/format';

import { toastSuccess } from '../../../bootstrap/config';
import { useAppContext } from '../../../contexts/AppProvider';
import {
  ResponseContext,
  useResponseContext,
} from '../../../contexts/ResponseProvider';
import useResponseUtils from '../../../hooks/useResponseUtils';
import { ArrowDownIcon, CheckIcon, ShareIcon } from '../../../icons';
import { isPermitted } from '../../can';
import FollowButton from '../../Team/FollowButton';
import ResponseHeaderButton from './ResponseHeaderButton';
import ResponseHeaderMenuItem from './ResponseHeaderMenuItem';
import ResponseHeaderStatus from './ResponseHeaderStatus';

const ReasponseHeader = () => {
  const { response, snapshot, handleRenewalOpen, setActiveTab } =
    useResponseContext();
  const history = useHistory();
  const toast = useToast();
  const {
    getStatus,
    getRenewalStatus,
    isEvidenceUploaded,
    areRequiredQuestionsAnswered,
  } = useResponseUtils();
  const { user } = useAppContext();
  const currentEvidenceItems = response?.evidence?.filter(
    ({ outdated }) => !outdated,
  );
  const { handleShareOpen } = useContext(ResponseContext);
  const [status, setStatus] = useState<'compliant' | 'nonCompliant' | ''>('');

  useEffect(() => {
    if (
      status === 'nonCompliant' &&
      getStatus(response) === 'compliant' &&
      !snapshot
    ) {
      toast({
        ...toastSuccess,
        title: 'Response completed',
        description: `${response.complianceItem.name} for ${
          response.businessUnit?.name
        } is compliant until ${
          response.nextRenewalDate
            ? format(new Date(response.nextRenewalDate), 'dd MMMM yyyy')
            : 'N/A'
        } `,
      });
      return setStatus('compliant');
    }
    setStatus(getStatus(response) || '');
  }, [response]);

  const enableRenewalButton = useMemo(() => {
    if (!response) return false;

    if (getRenewalStatus(response) === 'comingUp') {
      return isPermitted({
        user,
        data: { response },
        action: 'responses.edit',
      });
    }

    if (
      getRenewalStatus(response) === 'overdue' &&
      response.status === 'completed'
    ) {
      return isPermitted({
        user,
        data: { response },
        action: 'responses.edit',
      });
    }

    return false;
  }, [response, user]);

  if (!response) return null;

  return (
    <>
      <Flex
        bg="reasponseHeader.bg"
        direction="column"
        mb="15px"
        minH="100px"
        pl={6}
        w="full"
        zIndex={1}
      >
        <Stack
          alignItems="center"
          direction="row"
          h="40px"
          mb="15px"
          spacing={4}
          w="full"
        >
          <Heading
            alignItems={['flex-start', 'center']}
            color="reasponseHeader.heading"
            fontSize="xxl"
            fontWeight="bold"
          >
            {response?.complianceItem?.name}
          </Heading>
          {getRenewalStatus(response) === 'comingUp' ? (
            <Badge
              bg="reasponseHeader.badgeBg"
              borderRadius="10px"
              color="reasponseHeader.badge"
              colorScheme="reasponseHeader.badgeColorScheme"
              fontSize="11px"
              fontWeight="bold"
              lineHeight="16px"
              ml="13"
              padding="6px 15px"
              textTransform="capitalize"
            >
              Coming up
            </Badge>
          ) : (
            ''
          )}
          {snapshot && (
            <Stack
              align="center"
              color="reasponseHeader.snapshot.color"
              direction="row"
              spacing={1}
            >
              <WarningTwoIcon />
              <Text>
                You are seeing snapshot from{' '}
                {format(parseInt(snapshot, 10), 'd LLLL yyyy, HH:mm')}
              </Text>
              <Tooltip label="Close snapshot preview">
                <SmallCloseIcon
                  cursor="pointer"
                  onClick={() => {
                    setActiveTab(0);
                    history.push(`/compliance-item/${response._id}`);
                  }}
                />
              </Tooltip>
            </Stack>
          )}
        </Stack>
        <Flex mb="15px">
          <Flex
            alignItems="center"
            maxW={['100vw', '390px']}
            pl={['10px', '0px']}
            pr={['35px', '0px']}
            w="full"
          >
            <ResponseHeaderStatus
              heading="Compliant"
              status={
                response && getStatus(response) === 'compliant' ? 'Yes' : 'No'
              }
            />
            <Spacer />
            {currentEvidenceItems?.length > 0 && (
              <ResponseHeaderStatus
                heading="Evidence provided"
                status={isEvidenceUploaded(response) ? 'Yes' : 'No'}
              />
            )}
            <Spacer />
            <ResponseHeaderStatus
              heading="Questions answered"
              status={areRequiredQuestionsAnswered(response) ? 'Yes' : 'No'}
            />
          </Flex>
          <Spacer display={['none', 'flex']} />
          <Flex
            color="white"
            display={['none', 'flex']}
            h="40px"
            justify="flex-end"
            mr="27px"
          >
            <FollowButton />
            <ResponseHeaderButton
              icon={
                <ShareIcon
                  _groupHover={{
                    stroke: 'reasponseHeader.buttonLightColorHover',
                  }}
                  fontSize="15px"
                  stroke="reasponseHeader.buttonLightColor"
                />
              }
              name="Share"
              onClick={handleShareOpen}
            />
            {!['Ad-hoc', 'Variable'].includes(
              response?.complianceItem?.frequency,
            ) && (
              <Button
                _hover={{
                  bg: 'reasponseHeader.buttonDarkBgHover',
                  color: 'reasponseHeader.buttonDarkColorHover',
                }}
                bg={
                  enableRenewalButton
                    ? 'reasponseHeader.buttonDarkBg'
                    : 'reasponseHeader.buttonDarkBg'
                }
                borderRadius="10px"
                color={
                  enableRenewalButton
                    ? 'reasponseHeader.buttonDarkColor'
                    : 'reasponseHeader.buttonDarkColor'
                }
                display={['none', 'flex']}
                fontSize="smm"
                fontWeight="bold"
                isDisabled={!enableRenewalButton}
                ml="15px"
                onClick={handleRenewalOpen}
                w="88px"
              >
                Renew
              </Button>
            )}
          </Flex>
        </Flex>

        <Flex alignItems="center" display={['flex', 'none']} h="40px" mr="25px">
          <Menu>
            {({ isOpen }) => (
              <>
                <MenuButton
                  as={Button}
                  bg={
                    isOpen
                      ? 'reasponseHeader.optionsMenuBgOpen'
                      : 'reasponseHeader.optionsMenuBg'
                  }
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
                  {isOpen ? 'Options' : 'Options'}
                </MenuButton>

                <MenuList
                  borderColor="reasponseHeader.optionsMenuBorderColor"
                  borderRadius="10px"
                  boxShadow="0px 0px 80px"
                  color="reasponseHeader.optionsMenuBoxShadow"
                  minW={['calc(100vw - 50px)', '325px']}
                  w="100%"
                >
                  <FollowButton isMobile />
                  <ResponseHeaderMenuItem
                    icon={
                      <ShareIcon
                        _groupHover={{
                          stroke: 'reasponseHeader.buttonLightColorHover',
                        }}
                        fontSize="15px"
                        stroke="reasponseHeader.buttonLightColor"
                      />
                    }
                    onClick={handleShareOpen}
                    title="Share"
                  />
                  <MenuDivider
                    border="1px"
                    borderColor="reasponseHeader.optionsMenuDivider"
                    ml="20px"
                    mr="20px"
                  />
                  <ResponseHeaderMenuItem
                    icon={
                      <CheckIcon
                        _groupHover={{
                          stroke: 'reasponseHeader.buttonLightColorHover',
                        }}
                        fill="transparent"
                        fontSize="15px"
                        stroke="reasponseHeader.buttonLightColor"
                      />
                    }
                    onClick={handleRenewalOpen}
                    title="Renew"
                  />
                </MenuList>
              </>
            )}
          </Menu>
        </Flex>
      </Flex>
    </>
  );
};

export default ReasponseHeader;

export const responseHeaderStyles = {
  reasponseHeader: {
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
