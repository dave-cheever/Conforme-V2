import { useMemo } from 'react';

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
import { useAppContext } from '../../../contexts/AppProvider';
import { useResponseContext } from '../../../contexts/ResponseProvider';
import { useShareContext } from '../../../contexts/ShareProvider';
import useNavigate from '../../../hooks/useNavigate';
import useResponseUtils from '../../../hooks/useResponseUtils';
import { ArrowDownIcon, SaveIcon, ShareIcon, SubmitIcon } from '../../../icons';
import past from '../../../utils/tense';
import { isPermitted } from '../../can';
import ResponseHeaderButton from './ResponseHeaderButton';
import ResponseHeaderStatus from './ResponseHeaderStatus';

function ReasponseHeader() {
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
  const { user } = useAppContext();
  const isUserPermittedToSubmitDocument = useMemo(
    () => isPermitted({ user, action: 'responses.edit', data: { response } }),
    [JSON.stringify(user), JSON.stringify(response)],
  );

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
    <Flex
        data-id="030925-3f1a9e"
        direction="column"
        mb="15px"
        pl={6}
        pt={4}
        w="full"
        zIndex={1}>
      <Stack
        data-id="030925-ee7d85"
        alignItems={['flex-start', 'center']}
        direction={['column', 'row']}
        mb="15px"
        minH="40px"
        pr={6}
        spacing={2}
        w="full">
        <Heading
          data-id="030925-25030e"
          alignItems={['flex-start', 'center']}
          color="reasponseHeader.heading"
          fontSize="xxl"
          fontWeight="bold"
          noOfLines={1}>
          {response?.trackerItem?.name}
        </Heading>
        <HStack data-id="030925-aefe10">
          {response.status === 'draft' && (
            <Badge
              data-id="030925-e937c4"
              bg="reasponseHeader.badge.draft.bg"
              borderRadius="6px"
              color="reasponseHeader.badge.draft.color"
              fontSize="11px"
              fontWeight="bold"
              lineHeight="16px"
              px={2}
              py={1}
              textTransform="capitalize">
              Draft
            </Badge>
          )}
          {response.calculatedStatus === 'comingUp' && (
            <Badge
              data-id="030925-dc93c2"
              bg="reasponseHeader.badge.comingUp.bg"
              borderRadius="6px"
              color="reasponseHeader.badge.comingUp.color"
              fontSize="11px"
              fontWeight="bold"
              lineHeight="16px"
              px={2}
              py={1}
              textTransform="capitalize">
              Coming up
            </Badge>
          )}
          {response.calculatedStatus === 'nonCompliant' && (
            <Badge
              data-id="030925-291184"
              bg="reasponseHeader.badge.nonCompliant.bg"
              borderRadius="6px"
              color="reasponseHeader.badge.nonCompliant.color"
              fontSize="11px"
              fontWeight="bold"
              lineHeight="16px"
              px={2}
              py={1}
              textTransform="capitalize">
              {capitalize(t('non-compliant'))}
            </Badge>
          )}
        </HStack>
      </Stack>
      <Stack
        data-id="030925-c99154"
        direction={['column', 'row']}
        mb="15px"
        pr={6}
        spacing={4}>
        <HStack
          data-id="030925-b0aa82"
          alignItems="center"
          pl={['10px', '0px']}
          pr={['35px', '0px']}
          spacing={4}
          w={['full', 'auto']}>
          <ResponseHeaderStatus
            data-id="030925-1ab78a"
            heading={capitalize(t('compliant'))}
            status={response.calculatedStatus !== 'nonCompliant' ? 'Yes' : 'No'} />
          {response.evidence?.length > 0 && (
            <>
              <Spacer data-id="030925-bc397e" />
              <ResponseHeaderStatus
                data-id="030925-55f49a"
                heading="Evidence provided"
                status={isEvidenceUploaded(response) ? 'Yes' : 'No'} />
            </>
          )}
          {response.questions?.length > 0 && (
            <>
              <Spacer data-id="030925-833f4a" />
              <ResponseHeaderStatus
                data-id="030925-7cc26d"
                heading={`${capitalize(pluralize(t('question')))} ${past(t('answer'))}`}
                status={areRequiredQuestionsAnswered(response) ? 'Yes' : 'No'} />
            </>
          )}
        </HStack>
        {snapshot && (
          <Stack
            data-id="030925-d77f8f"
            align="center"
            color="reasponseHeader.snapshot.color"
            direction={['column', 'row']}
            spacing={1}>
            <WarningTwoIcon data-id="030925-b22539" />
            <Text data-id="030925-aaf87e">You are seeing historical data.</Text>
            <Text
              data-id="030925-ec31b9"
              as={Link}
              onClick={() => {
                setActiveTab(0);
                navigateTo(`/tracker-item/${response._id}`);
              }}>
              Click here to return.
            </Text>
          </Stack>
        )}
        <Spacer data-id="030925-2f6cd6" display={['flex']} />
        <Flex
          data-id="030925-4b53bc"
          color="white"
          columnGap={'8px'}
          display={['none', 'flex', 'flex']}
          h="40px"
          justify="flex-end"
          mr={6}>
          {/* <FollowButton /> */}
          {response.status === 'submitted' && !snapshot && (
            <ResponseHeaderButton
              data-id="030925-7ef3f4"
              name="Start review"
              onClick={handleRenewalOpen}
              primary={response.calculatedStatus === 'comingUp'} />
          )}
          {response.status === 'draft' && !snapshot && (
            <>
              <ResponseHeaderButton
                data-id="030925-195eec"
                icon={
                  <SaveIcon
                    data-id="030925-b2e8f6"
                    _groupHover={{
                      stroke: 'reasponseHeader.buttonLightColorHover',
                    }}
                    fontSize="15px"
                    stroke="reasponseHeader.buttonLightColor" />
                }
                name="Save"
                onClick={updateResponseQuestions} />
              <ResponseHeaderButton
                data-id="030925-8ef5c1"
                disabled={!areRequiredQuestionsAnswered(response) || !isEvidenceUploaded(response) || !isUserPermittedToSubmitDocument}
                icon={
                  <SubmitIcon
                    data-id="030925-6e2b48"
                    _groupHover={
                      !areRequiredQuestionsAnswered(response) || !isEvidenceUploaded(response)
                        ? {}
                        : {
                          stroke: 'reasponseHeader.buttonLightColorHover',
                        }
                    }
                    fontSize="15px"
                    stroke="reasponseHeader.buttonLightColor" />
                }
                name="Submit review"
                onClick={submitReview} />
            </>
          )}
          <ResponseHeaderButton
            data-id="030925-7a6451"
            icon={
              <ShareIcon
                data-id="030925-051cfa"
                _groupHover={{
                  stroke: 'reasponseHeader.buttonLightColorHover',
                }}
                fontSize="15px"
                stroke="reasponseHeader.buttonLightColor" />
            }
            name="Share"
            onClick={() => {
              setShareItemUrl(`tracker-item/${response?._id}${snapshot ? `?snapshot=${snapshot}` : ''}`);
              setShareItemName(response?.trackerItem?.name);
              handleShareOpen();
            }} />
        </Flex>
      </Stack>
      <Flex
        data-id="030925-8a5a29"
        alignItems="center"
        display={['flex', 'none']}
        h="40px"
        mr="25px">
        <Menu data-id="030925-1cc797">
          {({ isOpen }) => (
            <>
              <MenuButton
                data-id="030925-95d676"
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
                rightIcon={<ArrowDownIcon data-id="030925-d9d60f" />}
                textAlign="left"
                w="full">
                Options
              </MenuButton>

              <MenuList
                data-id="030925-8201fd"
                borderColor="reasponseHeader.optionsMenuBorderColor"
                borderRadius="10px"
                boxShadow="0px 0px 80px"
                color="reasponseHeader.optionsMenuBoxShadow"
                display={'flex'}
                flexDir={'column'}
                minW={['calc(100vw - 50px)', '325px']}
                w="100%"
                zIndex="10">
                {/* <FollowButton isMobile /> */}
                {response.status === 'submitted' && !snapshot && <ResponseHeaderButton data-id="030925-7402ee" isListView name="Start review" onClick={handleRenewalOpen} />}
                {response.status === 'draft' && !snapshot && (
                  <>
                    <ResponseHeaderButton data-id="030925-51f5f8" isListView name="Save" onClick={updateResponseQuestions} />
                    <ResponseHeaderButton data-id="030925-bd2d63" disabled={!areRequiredQuestionsAnswered(response) || !isEvidenceUploaded(response)} isListView name="Submit review" onClick={submitReview} />
                  </>
                )}

                <ResponseHeaderButton data-id="030925-3b9981" isListView name="Share" onClick={handleShareOpen}  />

                <MenuDivider
                  data-id="030925-e968ef"
                  border="1px"
                  borderColor="reasponseHeader.optionsMenuDivider"
                  ml="20px"
                  mr="20px" />
              </MenuList>
            </>
          )}
        </Menu>
      </Flex>
    </Flex>
  );
}

export default ReasponseHeader;

export const responseHeaderStyles = {
  reasponseHeader: {
    bg: '#f5f5f5',
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
