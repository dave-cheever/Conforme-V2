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
import ResponseHeaderMenuItem from './ResponseHeaderMenuItem';
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
    (<Flex
      bg="reasponseHeader.bg"
      data-id="8e7ece118cc4"
      direction="column"
      mb="15px"
      pl={6}
      w="full"
      zIndex={1}>
      <Stack
        alignItems="center"
        data-id="f8858aed86a9"
        direction={['column', 'row']}
        mb="15px"
        minH="40px"
        pr={6}
        spacing={2}
        w="full">
        <Heading
          alignItems={['flex-start', 'center']}
          color="reasponseHeader.heading"
          data-id="f6c5037acb19"
          fontSize="xxl"
          fontWeight="bold"
          noOfLines={1}>
          {response?.trackerItem?.name}
        </Heading>
        <HStack data-id="d7c0939031ba">
          {response.status === 'draft' && (
            <Badge
              bg="reasponseHeader.badge.draft.bg"
              borderRadius="6px"
              color="reasponseHeader.badge.draft.color"
              data-id="eba41ec58760"
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
              bg="reasponseHeader.badge.comingUp.bg"
              borderRadius="6px"
              color="reasponseHeader.badge.comingUp.color"
              data-id="d7acdb5adf5b"
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
              bg="reasponseHeader.badge.nonCompliant.bg"
              borderRadius="6px"
              color="reasponseHeader.badge.nonCompliant.color"
              data-id="a2141d345ef4"
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
        data-id="1b8064cadf66"
        direction={['column', 'row']}
        mb="15px"
        pr={6}
        spacing={4}>
        <HStack
          alignItems="center"
          data-id="529364ae8800"
          pl={['10px', '0px']}
          pr={['35px', '0px']}
          spacing={4}
          w={['full', 'auto']}>
          <ResponseHeaderStatus
            data-id="677faf0bb242"
            heading={capitalize(t('compliant'))}
            status={response.calculatedStatus !== 'nonCompliant' ? 'Yes' : 'No'} />
          {response.evidence?.length > 0 && (
            <>
              <Spacer data-id="0aa844396226" />
              <ResponseHeaderStatus
                data-id="844748eba9b1"
                heading="Evidence provided"
                status={isEvidenceUploaded(response) ? 'Yes' : 'No'} />
            </>
          )}
          {response.questions?.length > 0 && (
            <>
              <Spacer data-id="f980a326b709" />
              <ResponseHeaderStatus
                data-id="1aa3dc886a6c"
                heading={`${capitalize(pluralize(t('question')))} ${past(t('answer'))}`}
                status={areRequiredQuestionsAnswered(response) ? 'Yes' : 'No'} />
            </>
          )}
        </HStack>
        {snapshot && (
          <Stack
            align="center"
            color="reasponseHeader.snapshot.color"
            data-id="8fdbbd10443e"
            direction={['column', 'row']}
            spacing={1}>
            <WarningTwoIcon data-id="6cf0b57282f3" />
            <Text data-id="e3413ec9253c">You are seeing historical data.</Text>
            <Text
              as={Link}
              data-id="949bd3527a63"
              onClick={() => {
                setActiveTab(0);
                navigateTo(`/tracker-item/${response._id}`);
              }}>
              Click here to return.
            </Text>
          </Stack>
        )}
        <Spacer data-id="ad0936a55bab" display={['flex']} />
        <Flex
          color="white"
          data-id="7119e874716f"
          display={['flex']}
          h="40px"
          justify="flex-end"
          mr={6}>
          {/* <FollowButton /> */}
          {response.status === 'submitted' && !snapshot && (
            <ResponseHeaderButton
              data-id="3d443b457823"
              name="Start review"
              onClick={handleRenewalOpen}
              primary={response.calculatedStatus === 'comingUp'} />
          )}
          {response.status === 'draft' && !snapshot && (
            <>
              <ResponseHeaderButton
                data-id="8d41d0e31bfe"
                icon={
                  <SaveIcon
                    _groupHover={{
                      stroke: 'reasponseHeader.buttonLightColorHover',
                    }}
                    data-id="a3b7e50c9155"
                    fontSize="15px"
                    stroke="reasponseHeader.buttonLightColor" />
                }
                name="Save"
                onClick={updateResponseQuestions} />
              <ResponseHeaderButton
                data-id="c22fd4cdc142"
                disabled={!areRequiredQuestionsAnswered(response) || !isEvidenceUploaded(response) || !isUserPermittedToSubmitDocument}
                icon={
                  <SubmitIcon
                    _groupHover={
                      !areRequiredQuestionsAnswered(response) || !isEvidenceUploaded(response)
                        ? {}
                        : {
                            stroke: 'reasponseHeader.buttonLightColorHover',
                          }
                    }
                    data-id="a0ce37414d9f"
                    fontSize="15px"
                    stroke="reasponseHeader.buttonLightColor" />
                }
                name="Submit review"
                onClick={submitReview} />
            </>
          )}
          <ResponseHeaderButton
            data-id="dd248a43be84"
            icon={
              <ShareIcon
                _groupHover={{
                  stroke: 'reasponseHeader.buttonLightColorHover',
                }}
                data-id="0b6566f686b4"
                fontSize="15px"
                stroke="reasponseHeader.buttonLightColor" />
            }
            name="Share"
            onClick={() => {
              setShareItemUrl(`compliance-item/${response?._id}${snapshot ? `?snapshot=${snapshot}` : ''}`);
              setShareItemName(response?.trackerItem?.name);
              handleShareOpen();
            }} />
        </Flex>
      </Stack>
      <Flex
        alignItems="center"
        data-id="51fa1ba1e919"
        display={['flex', 'none']}
        h="40px"
        mr="25px">
        <Menu data-id="523d167c4b62">
          {({ isOpen }) => (
            <>
              <MenuButton
                as={Button}
                bg={isOpen ? 'reasponseHeader.optionsMenuBgOpen' : 'reasponseHeader.optionsMenuBg'}
                borderRadius="10px"
                color="reasponseHeader.optionsMenuButtonColor"
                colorScheme="reasponseHeader.optionsMenuColorScheme"
                data-id="732eba87a3cc"
                fontFamily="Helvetica"
                fontSize="smm"
                fontWeight="bold"
                isActive={isOpen}
                lineHeight="18px"
                rightIcon={<ArrowDownIcon data-id="bd8550f22a53" />}
                textAlign="left"
                w="full">
                'Options'
              </MenuButton>

              <MenuList
                borderColor="reasponseHeader.optionsMenuBorderColor"
                borderRadius="10px"
                boxShadow="0px 0px 80px"
                color="reasponseHeader.optionsMenuBoxShadow"
                data-id="2162de14e883"
                minW={['calc(100vw - 50px)', '325px']}
                w="100%"
                zIndex="10">
                {/* <FollowButton isMobile /> */}
                {response.status === 'submitted' && !snapshot && <ResponseHeaderButton data-id="4ed2d890331f" name="Start review" onClick={handleRenewalOpen} />}
                {response.status === 'draft' && !snapshot && (
                  <>
                    <ResponseHeaderMenuItem data-id="ea66366a036e" name="Save" onClick={updateResponseQuestions} />
                    <ResponseHeaderMenuItem
                      data-id="f292070c3b92"
                      disabled={!areRequiredQuestionsAnswered(response) || !isEvidenceUploaded(response)}
                      name="Submit review"
                      onClick={submitReview} />
                  </>
                )}
                <ResponseHeaderMenuItem
                  data-id="85fb49993c30"
                  icon={
                    <ShareIcon
                      _groupHover={{
                        stroke: 'reasponseHeader.buttonLightColorHover',
                      }}
                      data-id="52bca3f82603"
                      fontSize="15px"
                      stroke="reasponseHeader.buttonLightColor" />
                  }
                  name="Share"
                  onClick={handleShareOpen} />
                <MenuDivider
                  border="1px"
                  borderColor="reasponseHeader.optionsMenuDivider"
                  data-id="003a49493e35"
                  ml="20px"
                  mr="20px" />
              </MenuList>
            </>
          )}
        </Menu>
      </Flex>
    </Flex>)
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
