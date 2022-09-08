import { WarningTwoIcon } from '@chakra-ui/icons';
import {
  Badge,
  Button,
  Flex,
  Heading,
  HStack,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuList,
  Spacer,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import format from 'date-fns/format';
import { t } from 'i18next';
import { capitalize, isEqual } from 'lodash';
import pluralize from 'pluralize';

import { toastFailed, toastSuccess } from '../../../bootstrap/config';
import { useResponseContext } from '../../../contexts/ResponseProvider';
import { useShareContext } from '../../../contexts/ShareProvider';
import useNavigate from '../../../hooks/useNavigate';
import useResponseUtils from '../../../hooks/useResponseUtils';
import { ArrowDownIcon, ShareIcon } from '../../../icons';
import past from '../../../utils/tense';
import ResponseHeaderButton from './ResponseHeaderButton';
import ResponseHeaderMenuItem from './ResponseHeaderMenuItem';
import ResponseHeaderStatus from './ResponseHeaderStatus';

const ReasponseHeader = () => {
  const {
    response,
    snapshot,
    submitResponse,
    setActiveTab,
    questionsForm,
    updateQuestions,
    setIsQuestionFormDirty,
    refetch,
    handleRenewalOpen,
  } = useResponseContext();
  const { navigateTo } = useNavigate();
  const toast = useToast();
  const { isEvidenceUploaded, areRequiredQuestionsAnswered } = useResponseUtils();
  const { handleShareOpen, setShareItemUrl, setShareItemName } = useShareContext();

  const { watch } = questionsForm;
  const answers = watch();
  const updateResponseQuestions = async () => {
    const wasQuestionUpdated = response.questions.find(({ name, value }) => !isEqual(value, answers[name]));
    if (wasQuestionUpdated) {
      try {
        await updateQuestions({
          variables: {
            updateResponseQuestionsModify: {
              _id: response?._id,
              answers,
            },
          },
        });
        toast({
          ...toastSuccess,
          description: 'Answers saved',
        });
        setIsQuestionFormDirty(false);
        refetch();
      } catch (e: any) {
        toast({
          ...toastFailed,
          description: e.message,
        });
      }
    }
  };

  const submitReview = async () => {
    const submitted = await submitResponse({
      variables: {
        _id: response._id,
      },
    });
    if (submitted?.data?.submitResponse) {
      toast({
        ...toastSuccess,
        duration: 10000,
        title: 'Response completed',
        description: `${response.trackerItem.name} for ${response.businessUnit?.name} is ${t('compliant')} until ${format(
          new Date(submitted.data.submitResponse),
          'dd MMMM yyyy',
        )} `,
      });
    }
    refetch();
    setActiveTab(0);
  };

  if (!response) return null;
  return (
    <Flex bg="reasponseHeader.bg" direction="column" mb="15px" pl={6} w="full" zIndex={1}>
      <Stack alignItems="center" direction={['column', 'row']} mb="15px" minH="40px" pr={6} spacing={2} w="full">
        <Heading alignItems={['flex-start', 'center']} color="reasponseHeader.heading" fontSize="xxl" fontWeight="bold" noOfLines={1}>
          {response?.trackerItem?.name}
        </Heading>
        <HStack>
          {response.status === 'draft' && (
            <Badge
              bg="reasponseHeader.badge.draft.bg"
              borderRadius="6px"
              color="reasponseHeader.badge.draft.color"
              fontSize="11px"
              fontWeight="bold"
              lineHeight="16px"
              px={2}
              py={1}
              textTransform="capitalize"
            >
              Draft
            </Badge>
          )}
          {response.calculatedStatus === 'comingUp' && (
            <Badge
              bg="reasponseHeader.badge.comingUp.bg"
              borderRadius="6px"
              color="reasponseHeader.badge.comingUp.color"
              fontSize="11px"
              fontWeight="bold"
              lineHeight="16px"
              px={2}
              py={1}
              textTransform="capitalize"
            >
              Coming up
            </Badge>
          )}
          {response.calculatedStatus === 'nonCompliant' && (
            <Badge
              bg="reasponseHeader.badge.nonCompliant.bg"
              borderRadius="6px"
              color="reasponseHeader.badge.nonCompliant.color"
              fontSize="11px"
              fontWeight="bold"
              lineHeight="16px"
              px={2}
              py={1}
              textTransform="capitalize"
            >
              {capitalize(t('non-compliant'))}
            </Badge>
          )}
        </HStack>
      </Stack>
      <Stack direction={['column', 'row']} mb="15px" pr={6} spacing={4}>
        <HStack alignItems="center" pl={['10px', '0px']} pr={['35px', '0px']} spacing={4} w={['full', 'auto']}>
          <ResponseHeaderStatus heading={capitalize(t('compliant'))} status={response.calculatedStatus !== 'nonCompliant' ? 'Yes' : 'No'} />
          {response.evidence?.length > 0 && (
            <>
              <Spacer />
              <ResponseHeaderStatus heading="Evidence provided" status={isEvidenceUploaded(response) ? 'Yes' : 'No'} />
            </>
          )}
          {response.questions?.length > 0 && (
            <>
              <Spacer />
              <ResponseHeaderStatus
                heading={`${capitalize(pluralize(t('question')))} ${past(t('answer'))}`}
                status={areRequiredQuestionsAnswered(response) ? 'Yes' : 'No'}
              />
            </>
          )}
        </HStack>
        {snapshot && (
          <Stack align="center" color="reasponseHeader.snapshot.color" direction={['column', 'row']} spacing={1}>
            <WarningTwoIcon />
            <Text>You are seeing historical data.</Text>
            <Text
              as={Link}
              onClick={() => {
                setActiveTab(0);
                navigateTo(`/tracker-item/${response._id}`);
              }}
            >
              Click here to return.
            </Text>
          </Stack>
        )}
        <Spacer display={['none', 'flex']} />
        <Flex color="white" display={['none', 'flex']} h="40px" justify="flex-end" mr={6}>
          {/* <FollowButton /> */}
          {response.status === 'submitted' && !snapshot && (
            <ResponseHeaderButton name="Start review" onClick={handleRenewalOpen} primary={response.calculatedStatus === 'comingUp'} />
          )}
          {response.status === 'draft' && !snapshot && (
            <>
              <ResponseHeaderButton name="Save" onClick={updateResponseQuestions} />
              <ResponseHeaderButton
                disabled={!areRequiredQuestionsAnswered(response) || !isEvidenceUploaded(response)}
                name="Submit review"
                onClick={submitReview}
              />
            </>
          )}
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
            onClick={() => {
              setShareItemUrl(`compliance-item/${response?._id}${snapshot ? `?snapshot=${snapshot}` : ''}`);
              setShareItemName(response?.complianceItem?.name);
              handleShareOpen();
            }}
          />
        </Flex>
      </Stack>

      <Flex alignItems="center" display={['flex', 'none']} h="40px" mr="25px">
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
                'Options'
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
                {/* <FollowButton isMobile /> */}
                {response.status === 'submitted' && !snapshot && <ResponseHeaderButton name="Start review" onClick={handleRenewalOpen} />}
                {response.status === 'draft' && !snapshot && (
                  <>
                    <ResponseHeaderMenuItem name="Save" onClick={updateResponseQuestions} />
                    <ResponseHeaderMenuItem
                      disabled={!areRequiredQuestionsAnswered(response) || !isEvidenceUploaded(response)}
                      name="Submit review"
                      onClick={submitReview}
                    />
                  </>
                )}
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
                  name="Share"
                  onClick={handleShareOpen}
                />
                <MenuDivider border="1px" borderColor="reasponseHeader.optionsMenuDivider" ml="20px" mr="20px" />
              </MenuList>
            </>
          )}
        </Menu>
      </Flex>
    </Flex>
  );
};

export default ReasponseHeader;

export const responseHeaderStyles = {
  reasponseHeader: {
    bg: '#E5E5E5',
    heading: '#282F36',
    badge: {
      draft: {
        color: '#555',
        bg: 'rgba(85, 85, 85, 0.1)',
      },
      comingUp: {
        color: '#FF9A00',
        bg: 'rgba(255, 154, 0, 0.1)',
      },
      nonCompliant: {
        color: '#FC5960',
        bg: 'rgba(99, 35, 38, 0.1)',
      },
    },
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
