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
    <ModalContent
        data-id="030925-f6e4fa"
        bg="actionModal.bg"
        h="100%"
        m="0"
        overflow="hidden"
        p={[4, 6]}
        rounded="0">
      <ModalHeader
        data-id="030925-8f2678"
        alignItems="center"
        fontSize="xxl"
        fontWeight="bold"
        justifyContent="space-between"
        p="0">
        <Flex data-id="030925-b9a64d" justifyContent="space-between">
          <Flex data-id="030925-20c922" alignItems="center" fontSize={['14px', '24px']}>
            <Avatar
              data-id="030925-65ab0c"
              mr={3}
              name={answer?.addedBy?.displayName?.replace(/\s*\(.*?\)\s*/g, '')}
              rounded="full"
              size="xs"
              src={answer?.addedBy?.imgUrl} />
            <Text data-id="030925-8ea608" noOfLines={1}>{question?.question}</Text>
          </Flex>
          <Flex data-id="030925-3dd620" alignItems="center">
            <ShareButton
              data-id="030925-95351f"
              ariaLabel={`${capitalize(t('question'))}-share-button`}
              onClick={() => {
                setShareItemUrl(`answers?id=${answer?._id}`);
                setShareItemName(question?.question);
                handleShareOpen();
              }} />
            <Close
              data-id="030925-bb8cbd"
              cursor="pointer"
              h="15px"
              onClick={closeModal}
              stroke="answerModal.closeIcon"
              w="15px" />
          </Flex>
        </Flex>
      </ModalHeader>
      <ModalBody data-id="030925-7912f9" overflowY="auto" p="1rem 0 0 0">
        <Stack data-id="030925-cbc728" justify="space-between" spacing={2}>
          <Stack
            data-id="030925-e490f9"
            flexGrow={1}
            justify="space-between"
            overflowY="auto"
            px={2}
            py={0}
            spacing={6}>
            <Stack data-id="030925-f3babc" spacing={4}>
              <Text data-id="030925-8f1956" fontSize="smm" fontWeight="semibold">
                Related {t('audit')}
              </Text>
              <HStack
                data-id="030925-c473f8"
                bg="answerModal.question.bg"
                boxShadow="simple"
                flexGrow={1}
                justify="space-between"
                px={6}
                py={4}
                rounded="10px"
                spacing={2}>
                <Stack data-id="030925-f6f666" overflow="hidden" spacing={1}>
                  <Stack
                    data-id="030925-e6d286"
                    _hover={{
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }}
                    align="center"
                    direction="row"
                    onClick={() => openInNewTab(`/audits/${answer?.audit?._id}`)}
                    spacing={2}>
                    <Text
                      data-id="030925-032526"
                      color="answerModal.question.color"
                      fontSize="smm"
                      noOfLines={1}>
                      {`${answer?.audit?.auditor?.displayName} - ${answer?.audit?.reference}`}
                    </Text>
                    <OpenExternalIcon data-id="030925-d3ec6d" fill="transparent" stroke="black" />
                  </Stack>
                  <Text data-id="030925-f27815" color="answerModal.auditType" fontSize="ssm">
                    {answer?.audit?.auditType?.name}
                  </Text>
                  <Text
                    data-id="030925-cf432f"
                    color={`answerModal.status.${answer?.audit?.status}`}
                    fontSize="smm"
                    fontWeight="semibold">
                    {`${capitalize(answer?.audit?.status)}`}
                  </Text>
                </Stack>

                <HStack data-id="030925-3d3488" spacing={2}>
                  {(answer?.attachments || []).slice(0, 2).map((attachment) => (
                    <DocumentThumbnail data-id="030925-7f1d86" document={attachment} key={attachment.id} />
                  ))}
                  {(answer?.attachments || []).length > 2 &&
                    ((answer?.attachments || []).length === 3 ? (
                      <DocumentThumbnail
                        data-id="030925-f522ab"
                        document={answer!.attachments![2]}
                        key={answer!.attachments![2].id} />
                    ) : (
                      <Flex
                        data-id="030925-036306"
                        align="center"
                        border="1px solid black"
                        cursor="default"
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
            <Stack data-id="030925-0e5688" spacing={4}>
              <Text data-id="030925-9fe979" fontSize="smm" fontWeight="semibold">
                {capitalize(t('question'))} details
              </Text>
              <Grid
                data-id="030925-cc745a"
                columnGap={4}
                rowGap={4}
                templateColumns="repeat(2, 1fr)">
                <GridItem data-id="030925-331bf1">
                  <Text
                    data-id="030925-860889"
                    color="auditActionForm.labelFont.normal"
                    fontSize="11px"
                    fontWeight="bold">
                    Type
                  </Text>
                  <Text data-id="030925-865acf" fontSize="13px">{answer?.question?.questionsCategory?.name}</Text>
                </GridItem>
                {answer?.question?.category && (
                  <GridItem data-id="030925-a83ba4">
                    <Text
                      data-id="030925-e76eb0"
                      color="auditActionForm.labelFont.normal"
                      fontSize="11px"
                      fontWeight="bold">
                      Category
                    </Text>
                    <Text data-id="030925-692c26" fontSize="13px">{answer?.question?.category?.name}</Text>
                  </GridItem>
                )}
                <GridItem data-id="030925-99be53">
                  <Text
                    data-id="030925-c4b237"
                    color="auditActionForm.labelFont.normal"
                    fontSize="11px"
                    fontWeight="bold">
                    Date added
                  </Text>
                  <Text data-id="030925-a6b17e" fontSize="13px">{format(new Date(answer?.metatags?.addedAt!), 'd MMM yyyy')}</Text>
                </GridItem>
                {answer?.creator && (
                  <GridItem data-id="030925-3b7ed7">
                    <Text
                      data-id="030925-521cbb"
                      color="auditActionForm.labelFont.normal"
                      fontSize="11px"
                      fontWeight="bold">
                      Created by
                    </Text>
                    <Flex data-id="030925-1362bc" align="center" direction="row" mt={1}>
                      <Avatar
                        data-id="030925-c97f89"
                        name={answer?.creator?.displayName?.replace(/\s*\(.*?\)\s*/g, '')}
                        size="xs"
                        src={answer?.creator?.imgUrl} />
                      <Text
                        data-id="030925-0b2162"
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
                <GridItem data-id="030925-ffa017">
                  <Text
                    data-id="030925-c586b6"
                    color="auditActionForm.labelFont.normal"
                    fontSize="11px"
                    fontWeight="bold">
                    Unique ID
                  </Text>
                  <Text data-id="030925-c2625f" fontSize="13px">{answer?._id}</Text>
                </GridItem>
              </Grid>
              <Grid
                data-id="030925-4e4969"
                columnGap={4}
                rowGap={2}
                templateColumns="repeat(1, 1fr)">
                {questionsCategory?.withAnswers ? (
                  <>
                    <GridItem data-id="030925-6cc4a7">
                      {isCustomQuestion ? (
                        <TextInput
                          data-id="030925-eda74e"
                          control={control}
                          disabled={!isFormEnabled}
                          label="Question"
                          name="question"
                          required
                          validations={{
                            notEmpty: true,
                          }} />
                      ) : (
                        <Text data-id="030925-d188bd">{question?.question}</Text>
                      )}
                    </GridItem>
                    <GridItem data-id="030925-2e491c">
                      <TextInputMultiline
                        data-id="030925-2c22f9"
                        control={control}
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
                    data-id="030925-01257d"
                    control={control}
                    disabled={!isFormEnabled}
                    label="Description"
                    name="question"
                    required
                    validations={{
                      notEmpty: true,
                    }} />
                )}
                {questionsCategory?.useStatus && (
                  <GridItem data-id="030925-45b340">
                    <Dropdown
                      data-id="030925-7a4192"
                      control={control}
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
                <GridItem data-id="030925-ac5bd9">
                  {questionsCategory?.options && (
                    <Stack data-id="030925-4c7f30">
                      {questionsCategory.options.map(({ name, setting }) => (
                        <Toggle
                          data-id="030925-7c455a"
                          control={control}
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
              <Stack data-id="030925-e95e39">
                {isUserPermittedToModify && !!isFormEnabled && (
                  <>
                    <Text data-id="030925-e6375e" fontSize="11px" fontWeight="700" mb={2}>
                      Add photos or files
                    </Text>
                    <DocumentUpload
                      data-id="030925-0745ee"
                      callback={async (uploaded) => appendAttachment(uploaded)}
                      elementId={answer?._id || `temp-${question?._id}`} />
                  </>
                )}
                {values.attachments?.map((attachment, i) => (
                  <Flex data-id="030925-7bd2d9" flexDir="column" key={i} mb={2}>
                    <DocumentUploaded
                      data-id="030925-0dcbd1"
                      callback={async () => removeAttachment(i)}
                      document={attachment}
                      downloadable
                      removable={!!isFormEnabled} />
                  </Flex>
                ))}
                {values.attachments?.length === 0 && !isUserPermittedToModify && <Text data-id="030925-2c8a68" fontSize="sm">No uploaded attachments</Text>}
              </Stack>

              {Array.isArray(answer?.actions) && answer!.actions!.length > 0 && (
                <Stack data-id="030925-f8e9cc" spacing={4}>
                  <Text data-id="030925-3b9828" fontSize="smm" fontWeight="semibold">
                    Actions
                  </Text>
                  {answer?.actions?.map((action, index) => (
                    <ActionListItem
                      data-id="030925-9b5d6c"
                      action={action}
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
      <ModalFooter data-id="030925-bc0e5f" p={1}>
        <Flex
          data-id="030925-04fc53"
          flexBasis="calc(40px + 1rem)"
          flexShrink={0}
          justify="space-between"
          w="full">
          <Can
            data-id="030925-089efb"
            action="answers.delete"
            data={{ answer, audit: answer?.audit }}
            // eslint-disable-next-line react/no-unstable-nested-components
            yes={() => (
              <Button
                data-id="030925-34d536"
                bg="answerModal.buttons.secondary.bg"
                color="answerModal.buttons.secondary.color"
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
          <Spacer data-id="030925-86e7e4" />
          {(isFormEnabled || canChangeStatus) && (
            <Button
              data-id="030925-8e5e50"
              bg="answerModal.buttons.primary.bg"
              color="answerModal.buttons.primary.color"
              disabled={!isValid}
              fontSize="smm"
              fontWeight="700"
              h="40px"
              ml={3}
              onClick={handlePrimaryButtonClick}
              rightIcon={<Icon
                data-id="030925-60db16"
                as={TickIcon}
                size={24}
                stroke="answerModal.buttons.primary.icon" />}
              rounded="10px"
              w="fit-content">
              Update
            </Button>
          )}
        </Flex>
      </ModalFooter>
    </ModalContent>
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
