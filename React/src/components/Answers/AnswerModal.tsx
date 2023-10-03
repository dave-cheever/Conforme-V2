import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { gql, useMutation } from '@apollo/client';
import {
  Avatar,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spacer,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { t } from 'i18next';
import { capitalize } from 'lodash';

import { toastFailed, toastSuccess } from '../../bootstrap/config';
import { useAppContext } from '../../contexts/AppProvider';
import { useShareContext } from '../../contexts/ShareProvider';
import useNavigate from '../../hooks/useNavigate';
import { Close, OpenExternalIcon, TickIcon } from '../../icons';
import { IAnswer } from '../../interfaces/IAnswer';
import { IQuestion } from '../../interfaces/IQuestion';
import ActionListItem from '../Actions/ActionListItem';
import Can, { isPermitted } from '../can';
import DocumentThumbnail from '../Documents/DocumentThumbnail';
import DocumentUpload from '../Documents/DocumentUpload';
import DocumentUploaded from '../Documents/DocumentUploaded';
import { Dropdown, TextInput, Toggle } from '../Forms';
import TextInputMultiline from '../Forms/TextInputMultiline';
import ShareButton from '../ShareButton';

const SAVE_QUESTION = gql`
  mutation SaveQuestion($question: QuestionModifyInput!) {
    updateQuestion(questionInput: $question) {
      _id
    }
  }
`;
const SAVE_ANSWER = gql`
  mutation SaveAnswer($answer: AnswerModifyInput!) {
    updateAnswer(answerInput: $answer) {
      _id
    }
  }
`;

function AnswerModal({
  answer,
  refetch,
  handleDeleteQuestionModalOpen,
  closeModal,
}: {
  answer?: IAnswer;
  refetch: () => void;
  handleDeleteQuestionModalOpen: () => void;
  closeModal: () => void;
}) {
  const toast = useToast();
  const { openInNewTab } = useNavigate();
  const { user } = useAppContext();
  const { handleShareOpen, setShareItemUrl, setShareItemName } = useShareContext();
  const { question, audit } = answer as IAnswer;
  const { questionsCategory } = question as IQuestion<any>;
  const isCustomQuestion = !!question?.scope?._id;
  const isUserPermittedToModify = isPermitted({
    user,
    action: 'answers.edit',
    data: { answer, audit: answer?.audit },
  });
  const isUserPermittedToModifyStatus = isPermitted({
    user,
    action: 'answers.editStatus',
  });

  /**
   *
   * Few cases needs to be considered to decide if form should be enabled or not
   * 1. Does user has permissions to edit this answer?
   *  1.1. Admins can edit all answers
   *  1.2. Non-admins must be either auditor or participant
   * 2. Has an answer a "status"?
   *    There is an option in Questions Category that specifies if status should be used
   *  2.1. Only admins can change "status" field
   *  2.2. If set to "Yes" then status dropdown appear on the modal
   *    2.2.1. If "status" is "Closed" then no one can edit the answer
   *    2.2.2. If "status" is "Open" then answer can be edited
   *  2.3. If set to "No" then status dropdown doesn't appear on the modal
   * 3. Is audit completed?
   *    There is an option in Questions Category that allows answers to be edited after submission of audit ("Editable after submission" option)
   *  2.1. If set to "Yes" then answer can be edited as long as its "status" is not "Closed", or forever if there is no "status" field
   *  2.2. If set to "No" then answer can't be edited (only "status" field can if it is "Open")
   *
   */
  let isFormEnabled = isUserPermittedToModify;
  if (audit?.status === 'completed') {
    if (questionsCategory?.notBlockedAfterCompletion) {
      if (questionsCategory?.useStatus && answer?.status === 'closed') isFormEnabled = false;
      else isFormEnabled = isUserPermittedToModify;
    } else isFormEnabled = false;
  }

  const canChangeStatus = questionsCategory?.useStatus && isUserPermittedToModifyStatus && answer?.status !== 'closed';

  const [saveQuestion] = useMutation(SAVE_QUESTION);
  const [saveAnswer] = useMutation(SAVE_ANSWER);

  const { control, formState, watch, reset } = useForm({
    mode: 'all',
  });
  const { isValid } = formState;
  const values = watch();

  const { append: appendAttachment, remove: removeAttachment } = useFieldArray({
    control,
    name: 'attachments',
  });

  useEffect(() => {
    reset({
      status: answer?.status,
      attachments: answer?.attachments ?? [],
      question: question?.question || '',
      options: answer?.options || {},
      answer: answer?.answer || '',
    });
  }, [JSON.stringify(answer)]);

  const handlePrimaryButtonClick = async () => {
    if (!answer) return;

    const questionData = {
      _id: answer?.questionId,
      question: values.question,
    };

    const answerData = {
      _id: answer._id,
      options: values.options,
      answer: values.answer,
      status: values.status,
      attachments: values.attachments?.map((attachment) => ({
        id: attachment.id,
        name: attachment.name,
        addedAt: attachment.addedAt,
      })),
    };

    try {
      if (isCustomQuestion) await saveQuestion({ variables: { question: questionData } });
      await saveAnswer({ variables: { answer: answerData } });
      refetch();
      toast({ ...toastSuccess, description: `${capitalize(t('question'))} saved` });
    } catch (e: any) {
      toast({
        ...toastFailed,
        description: e.message,
      });
    } finally {
      closeModal();
    }
  };

  return (
    (<ModalContent
      bg="actionModal.bg"
      data-id="60f6bdf9feda"
      h="100vh"
      m="0"
      overflow="hidden"
      p={[4, 6]}
      rounded="0">
      <ModalHeader
        alignItems="center"
        data-id="691f9ae69764"
        fontSize="xxl"
        fontWeight="bold"
        justifyContent="space-between"
        p="0">
        <Flex data-id="00b3950a2b23" justifyContent="space-between">
          <Flex alignItems="center" data-id="c417ec861216" fontSize={['14px', '24px']}>
            <Avatar
              data-id="9586146a9e69"
              mr={3}
              name={answer?.addedBy?.displayName}
              rounded="full"
              size="xs"
              src={answer?.addedBy?.imgUrl} />
            <Text data-id="482e1723c2f1" noOfLines={1}>{question?.question}</Text>
          </Flex>
          <Flex alignItems="center" data-id="93c636bc7b9d">
            <ShareButton
              ariaLabel={`${capitalize(t('question'))}-share-button`}
              data-id="c83f7606caf7"
              onClick={() => {
                setShareItemUrl(`answers?id=${answer?._id}`);
                setShareItemName(question?.question);
                handleShareOpen();
              }} />
            <Close
              cursor="pointer"
              data-id="589e2bfee231"
              h="15px"
              onClick={closeModal}
              stroke="answerModal.closeIcon"
              w="15px" />
          </Flex>
        </Flex>
      </ModalHeader>
      <ModalBody data-id="b9093fcec035" overflowY="auto" p="1rem 0 0 0">
        <Stack data-id="0d4be4ffb63c" justify="space-between" spacing={2}>
          <Stack
            data-id="d8fdf2387e44"
            flexGrow={1}
            justify="space-between"
            overflowY="auto"
            px={2}
            py={0}
            spacing={6}>
            <Stack data-id="ec8daa8cdc28" spacing={4}>
              <Text data-id="adc40de76aed" fontSize="smm" fontWeight="semibold">
                Related {t('audit')}
              </Text>
              <HStack
                bg="answerModal.question.bg"
                boxShadow="simple"
                data-id="ecbebfa18549"
                flexGrow={1}
                justify="space-between"
                px={6}
                py={4}
                rounded="10px"
                spacing={2}>
                <Stack data-id="e5c6930c13d3" overflow="hidden" spacing={1}>
                  <Stack
                    _hover={{
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }}
                    align="center"
                    data-id="9826a9e525c7"
                    direction="row"
                    onClick={() => openInNewTab(`/audits/${answer?.audit?._id}`)}
                    spacing={2}>
                    <Text
                      color="answerModal.question.color"
                      data-id="971500565d8b"
                      fontSize="smm"
                      noOfLines={1}>
                      {`${answer?.audit?.auditor?.displayName} - ${answer?.audit?.reference}`}
                    </Text>
                    <OpenExternalIcon data-id="306ec541fe07" fill="transparent" stroke="black" />
                  </Stack>
                  <Text color="answerModal.auditType" data-id="16a19081644c" fontSize="ssm">
                    {answer?.audit?.auditType?.name}
                  </Text>
                  <Text
                    color={`answerModal.status.${answer?.audit?.status}`}
                    data-id="b081f5a4ed7e"
                    fontSize="smm"
                    fontWeight="semibold">
                    {`${capitalize(answer?.audit?.status)}`}
                  </Text>
                </Stack>

                <HStack data-id="ad897983bc34" spacing={2}>
                  {(answer?.attachments || []).slice(0, 2).map((attachment) => (
                    <DocumentThumbnail data-id="f16a070b3483" document={attachment} key={attachment.id} />
                  ))}
                  {(answer?.attachments || []).length > 2 &&
                    ((answer?.attachments || []).length === 3 ? (
                      <DocumentThumbnail
                        data-id="604615890dac"
                        document={answer!.attachments![2]}
                        key={answer!.attachments![2].id} />
                    ) : (
                      <Flex
                        align="center"
                        border="1px solid black"
                        cursor="default"
                        data-id="f8ca5a767be8"
                        h="55px"
                        justify="center"
                        rounded="3px"
                        w="55px">
                        +{(answer?.attachments || []).length - 2}
                      </Flex>
                    ))}
                </HStack>
              </HStack>
            </Stack>
            <Stack data-id="25e55a0432da" spacing={4}>
              <Text data-id="02671bfd0128" fontSize="smm" fontWeight="semibold">
                {capitalize(t('question'))} details
              </Text>
              <Grid
                columnGap={4}
                data-id="8cdf901c9c16"
                rowGap={4}
                templateColumns="repeat(2, 1fr)">
                <GridItem data-id="083d44c581eb">
                  <Text
                    color="auditActionForm.labelFont.normal"
                    data-id="ffa9bf9e0fa5"
                    fontSize="11px"
                    fontWeight="bold">
                    Type
                  </Text>
                  <Text data-id="ec06a7172f7d" fontSize="13px">{answer?.question?.questionsCategory?.name}</Text>
                </GridItem>
                {answer?.question?.category && (
                  <GridItem data-id="5fed2ac0a42d">
                    <Text
                      color="auditActionForm.labelFont.normal"
                      data-id="6caa22dde2cf"
                      fontSize="11px"
                      fontWeight="bold">
                      Category
                    </Text>
                    <Text data-id="deaa06398685" fontSize="13px">{answer?.question?.category?.name}</Text>
                  </GridItem>
                )}
                <GridItem data-id="c10df0be7ee5">
                  <Text
                    color="auditActionForm.labelFont.normal"
                    data-id="b1d5f6b17b7b"
                    fontSize="11px"
                    fontWeight="bold">
                    Date added
                  </Text>
                  <Text data-id="0219e1e5b4ca" fontSize="13px">{format(new Date(answer?.metatags?.addedAt!), 'd MMM yyyy')}</Text>
                </GridItem>
                {answer?.creator && (
                  <GridItem data-id="bcde15fe79fb">
                    <Text
                      color="auditActionForm.labelFont.normal"
                      data-id="97849ed04bef"
                      fontSize="11px"
                      fontWeight="bold">
                      Created by
                    </Text>
                    <Flex align="center" data-id="deadbc4c7da0" direction="row" mt={1}>
                      <Avatar
                        data-id="a9bac42fe470"
                        name={answer?.creator?.displayName}
                        size="xs"
                        src={answer?.creator?.imgUrl} />
                      <Text
                        data-id="e4d003a12817"
                        fontSize="13px"
                        lineHeight="17px"
                        opacity="1"
                        overflow="hidden"
                        pl={3}
                        textOverflow="ellipsis"
                        w="full"
                        whiteSpace="nowrap">
                        {answer?.creator?.displayName}
                      </Text>
                    </Flex>
                  </GridItem>
                )}
                <GridItem data-id="ac005fbdf1eb">
                  <Text
                    color="auditActionForm.labelFont.normal"
                    data-id="876c9d8e0649"
                    fontSize="11px"
                    fontWeight="bold">
                    Unique ID
                  </Text>
                  <Text data-id="4795414032c0" fontSize="13px">{answer?._id}</Text>
                </GridItem>
              </Grid>
              <Grid
                columnGap={4}
                data-id="4988bd56cc9a"
                rowGap={2}
                templateColumns="repeat(1, 1fr)">
                {questionsCategory?.withAnswers ? (
                  <>
                    <GridItem data-id="9b8d5239132d">
                      {isCustomQuestion ? (
                        <TextInput
                          control={control}
                          data-id="489bbed90ae7"
                          disabled={!isFormEnabled}
                          label="Question"
                          name="question"
                          required
                          validations={{
                            notEmpty: true,
                          }} />
                      ) : (
                        <Text data-id="0c26204dfaa7">{question?.question}</Text>
                      )}
                    </GridItem>
                    <GridItem data-id="0f68e68cbd46">
                      <TextInputMultiline
                        control={control}
                        data-id="6e47751a52eb"
                        disabled={!isFormEnabled}
                        label="Answer"
                        name="answer"
                        required
                        validations={{
                          notEmpty: true,
                        }} />
                    </GridItem>
                  </>
                ) : (
                  <TextInputMultiline
                    control={control}
                    data-id="ba4b32274d20"
                    disabled={!isFormEnabled}
                    label="Description"
                    name="question"
                    required
                    validations={{
                      notEmpty: true,
                    }} />
                )}
                {questionsCategory?.useStatus && (
                  <GridItem data-id="3341ba55c7d8">
                    <Dropdown
                      control={control}
                      data-id="63630d3cb673"
                      disabled={!canChangeStatus}
                      label="Status"
                      name="status"
                      options={[
                        { label: 'Open', value: 'open' },
                        { label: 'Closed', value: 'closed' },
                      ]}
                      stroke="dropdown.icon"
                      variant="secondaryVariant" />
                  </GridItem>
                )}
                <GridItem data-id="feb2bab11e97">
                  {questionsCategory?.options && (
                    <Stack data-id="ac12f8c5acf4">
                      {questionsCategory.options.map(({ name, setting }) => (
                        <Toggle
                          control={control}
                          data-id="89847dd4238d"
                          disabled={!isFormEnabled}
                          falseLabel={name}
                          key={name}
                          name={`options[${setting}]`}
                          trueLabel={name} />
                      ))}
                    </Stack>
                  )}
                </GridItem>
              </Grid>
              <Stack data-id="37130a0b5889">
                {isUserPermittedToModify && !!isFormEnabled && (
                  <>
                    <Text data-id="201527f6b21e" fontSize="11px" fontWeight="700" mb={2}>
                      Add photos or files
                    </Text>
                    <DocumentUpload
                      callback={async (uploaded) => appendAttachment(uploaded)}
                      data-id="ddadc80b2de4"
                      elementId={answer?._id || `temp-${question?._id}`} />
                  </>
                )}
                {values.attachments?.map((attachment, i) => (
                  <Flex data-id="13d223531f03" flexDir="column" key={i} mb={2}>
                    <DocumentUploaded
                      callback={async () => removeAttachment(i)}
                      data-id="a4d906b4c947"
                      document={attachment}
                      downloadable
                      removable={!!isFormEnabled} />
                  </Flex>
                ))}
                {values.attachments?.length === 0 && !isUserPermittedToModify && <Text data-id="6345cf33304f" fontSize="sm">No uploaded attachments</Text>}
              </Stack>

              {Array.isArray(answer?.actions) && answer!.actions!.length > 0 && (
                <Stack data-id="a333550c9afa" spacing={4}>
                  <Text data-id="5c32442f0832" fontSize="smm" fontWeight="semibold">
                    Actions
                  </Text>
                  {answer?.actions?.map((action, index) => (
                    <ActionListItem
                      action={action}
                      data-id="036416285ee3"
                      disabled
                      index={index}
                      key={action._id} />
                  ))}
                </Stack>
              )}
            </Stack>
          </Stack>
        </Stack>
      </ModalBody>
      <ModalFooter data-id="4e7153c01e39" p={1}>
        <Flex
          data-id="25c45170af71"
          flexBasis="calc(40px + 1rem)"
          flexShrink={0}
          justify="space-between"
          w="full">
          <Can
            action="answers.delete"
            data={{ answer, audit: answer?.audit }}
            data-id="f62dc58ed779"
            // eslint-disable-next-line react/no-unstable-nested-components
            yes={() => (
              <Button
                bg="answerModal.buttons.secondary.bg"
                color="answerModal.buttons.secondary.color"
                data-id="74c68864f256"
                fontSize="smm"
                fontWeight="700"
                h="40px"
                ml={3}
                onClick={handleDeleteQuestionModalOpen}
                rounded="10px"
                w="fit-content">
                Delete
              </Button>
            )} />
          <Spacer data-id="290ca7f53482" />
          {(isFormEnabled || canChangeStatus) && (
            <Button
              bg="answerModal.buttons.primary.bg"
              color="answerModal.buttons.primary.color"
              data-id="88e5feac2a94"
              disabled={!isValid}
              fontSize="smm"
              fontWeight="700"
              h="40px"
              ml={3}
              onClick={handlePrimaryButtonClick}
              rightIcon={<Icon
                as={TickIcon}
                data-id="00ebbcc2a756"
                size={24}
                stroke="answerModal.buttons.primary.icon" />}
              rounded="10px"
              w="fit-content">
              Update
            </Button>
          )}
        </Flex>
      </ModalFooter>
    </ModalContent>)
  );
}

export default AnswerModal;

export const answerModalStyles = {
  answerModal: {
    shareButton: {
      bg: '#FFFFFF',
      hoverBg: '#818197',
      icon: {
        stroke: '#818197',
        hoverStroke: '#FFFFFF',
      },
    },
    status: {
      completed: '#62c240',
      missed: '#FC5960',
      upcoming: '#FFA012',
    },
    bg: '#ffffff',
    closeIcon: '#282F36',
    question: {
      color: '#1E1836',
      bg: '#FFFFFF',
    },
    auditType: '#1E183670',
    buttons: {
      primary: {
        icon: '#ffffff',
        bg: '#DC0043',
        color: '#ffffff',
      },
      secondary: {
        bg: '#1E1836',
        color: '#FFFFFF',
      },
    },
  },
};
