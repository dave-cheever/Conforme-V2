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
import { isPermitted } from '../can';
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

const WalkItemModal = ({
  walkItem,
  refetch,
  handleDeleteQuestionModalOpen,
  closeModal,
}: {
  walkItem?: IAnswer;
  refetch: () => void;
  handleDeleteQuestionModalOpen: () => void;
  closeModal: () => void;
}) => {
  const toast = useToast();
  const { openInNewTab } = useNavigate();
  const { user } = useAppContext();
  const { handleShareOpen, setShareItemUrl, setShareItemName } = useShareContext();
  const { question } = walkItem as IAnswer;
  const { questionsCategory } = question as IQuestion<any>;
  const isCustomQuestion = !!question?.scope?._id;
  const isUserPermittedToModify = isPermitted({
    user,
    action: 'answers.edit',
    data: { answer: walkItem, audit: walkItem?.audit },
  });
  const isUserPermittedToModifyStatus = isPermitted({
    user,
    action: 'answers.editStatus',
  });
  const isDisabled =
    !!(walkItem?.audit?.status === 'completed' && (questionsCategory?.notBlockedAfterCompletion ? !!walkItem?._id : true)) ||
    !isUserPermittedToModify;

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
      status: walkItem?.status,
      attachments: walkItem?.attachments ?? [],
      question: question?.question || '',
      options: walkItem?.options || {},
      answer: walkItem?.answer || '',
    });
  }, [JSON.stringify(walkItem)]);

  const handlePrimaryButtonClick = async () => {
    if (!walkItem) return;

    const questionData = {
      _id: walkItem?.questionId,
      question: values.question,
    };

    const answerData = {
      _id: walkItem._id,
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
      toast({ ...toastSuccess, description: 'Walk item saved' });
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
    <>
      <ModalContent bg="actionModal.bg" h={['auto', '100vh']} m="0" mb={[4, 0, 0]} overflow="hidden" p={[4, 6]} rounded="0">
        <ModalHeader alignItems="center" fontSize="xxl" fontWeight="bold" justifyContent="space-between" p="0">
          <Flex justifyContent="space-between">
            <Flex alignItems="center" fontSize={['14px', '24px']}>
              <Avatar mr={3} name={walkItem?.addedBy?.displayName} rounded="full" size="xs" src={walkItem?.addedBy?.imgUrl} />
              <Text noOfLines={1}>{question?.question}</Text>
            </Flex>
            <Flex alignItems="center">
              <ShareButton
                ariaLabel={`${capitalize(t('question'))}-share-button`}
                onClick={() => {
                  setShareItemUrl(`walk-items?id=${walkItem?._id}`);
                  setShareItemName(question?.question);
                  handleShareOpen();
                }}
              />
              <Close cursor="pointer" h="15px" onClick={closeModal} stroke="walkItemModal.closeIcon" w="15px" />
            </Flex>
          </Flex>
        </ModalHeader>
        <ModalBody h="calc(100% - 1rem)" p="1rem 0 0 0">
          <Stack h="100%" justify="space-between" spacing={2}>
            <Stack flexGrow={1} overflowY="auto" px={2} py={0} spacing={6}>
              <Stack spacing={4}>
                <Text fontSize="smm" fontWeight="semibold">
                  Related {t('audit')}
                </Text>
                <HStack
                  bg="walkItemModal.question.bg"
                  boxShadow="simple"
                  flexGrow={1}
                  justify="space-between"
                  px={6}
                  py={4}
                  rounded="10px"
                  spacing={2}
                >
                  <Stack overflow="hidden" spacing={1}>
                    <Stack
                      _hover={{
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                      align="center"
                      direction="row"
                      onClick={() => openInNewTab(`/audits/${walkItem?.audit?._id}`)}
                      spacing={2}
                    >
                      <Text color="walkItemModal.question.color" fontSize="smm" isTruncated>
                        {`${walkItem?.audit?.auditor?.displayName} - ${walkItem?.audit?.reference}`}
                      </Text>
                      <OpenExternalIcon fill="transparent" stroke="black" />
                    </Stack>
                    <Text color="walkItemModal.auditType" fontSize="ssm">
                      {walkItem?.audit?.auditType?.name}
                    </Text>
                    <Text color={`walkItemModal.status.${walkItem?.audit?.status}`} fontSize="smm" fontWeight="semibold">
                      {`${capitalize(walkItem?.audit?.status)}`}
                    </Text>
                  </Stack>

                  <HStack spacing={2}>
                    {(walkItem?.attachments || []).slice(0, 2).map((attachment) => (
                      <DocumentThumbnail document={attachment} key={attachment.id} />
                    ))}
                    {(walkItem?.attachments || []).length > 2 &&
                      ((walkItem?.attachments || []).length === 3 ? (
                        <DocumentThumbnail document={walkItem!.attachments![2]} key={walkItem!.attachments![2].id} />
                      ) : (
                        <Flex align="center" border="1px solid black" cursor="default" h="55px" justify="center" rounded="3px" w="55px">
                          +{(walkItem?.attachments || []).length - 2}
                        </Flex>
                      ))}
                  </HStack>
                </HStack>
              </Stack>
              <Stack spacing={4}>
                <Text fontSize="smm" fontWeight="semibold">
                  Walk item details
                </Text>
                <Grid columnGap={4} rowGap={4} templateColumns="repeat(2, 1fr)">
                  <GridItem>
                    <Text color="auditActionForm.labelFont.normal" fontSize="11px" fontWeight="bold">
                      Type
                    </Text>
                    <Text fontSize="13px">{walkItem?.question?.questionsCategory?.name}</Text>
                  </GridItem>
                  <GridItem>
                    <Text color="auditActionForm.labelFont.normal" fontSize="11px" fontWeight="bold">
                      Date added
                    </Text>
                    <Text fontSize="13px">{format(new Date(walkItem?.metatags?.addedAt!), 'd MMM yyyy')}</Text>
                  </GridItem>
                  {walkItem?.creator && (
                    <GridItem>
                      <Text color="auditActionForm.labelFont.normal" fontSize="11px" fontWeight="bold">
                        Created by
                      </Text>
                      <Flex align="center" direction="row" mt={1}>
                        <Avatar name={walkItem?.creator?.displayName} size="xs" src={walkItem?.creator?.imgUrl} />
                        <Text
                          fontSize="13px"
                          lineHeight="17px"
                          opacity="1"
                          overflow="hidden"
                          pl={3}
                          textOverflow="ellipsis"
                          w="full"
                          whiteSpace="nowrap"
                        >
                          {walkItem?.creator?.displayName}
                        </Text>
                      </Flex>
                    </GridItem>
                  )}
                  <GridItem>
                    <Text color="auditActionForm.labelFont.normal" fontSize="11px" fontWeight="bold">
                      Unique ID
                    </Text>
                    <Text fontSize="13px">{walkItem?._id}</Text>
                  </GridItem>
                </Grid>
                <Grid columnGap={4} rowGap={2} templateColumns="repeat(1, 1fr)">
                  {questionsCategory?.withAnswers ? (
                    <>
                      <GridItem>
                        {isCustomQuestion ? (
                          <TextInput
                            control={control}
                            disabled={isDisabled}
                            label="Question"
                            name="question"
                            required
                            validations={{
                              notEmpty: true,
                            }}
                          />
                        ) : (
                          <Text>{question?.question}</Text>
                        )}
                      </GridItem>
                      <GridItem>
                        <TextInputMultiline
                          control={control}
                          disabled={isDisabled}
                          label="Answer"
                          name="answer"
                          required
                          validations={{
                            notEmpty: true,
                          }}
                        />
                      </GridItem>
                    </>
                  ) : (
                    <TextInputMultiline
                      control={control}
                      disabled={isDisabled}
                      label="Description"
                      name="question"
                      required
                      validations={{
                        notEmpty: true,
                      }}
                    />
                  )}
                  {questionsCategory?.useStatus && (
                    <GridItem>
                      <Dropdown
                        control={control}
                        disabled={!isUserPermittedToModifyStatus || walkItem?.status === 'closed'}
                        label="Status"
                        name="status"
                        options={[
                          { label: 'Open', value: 'open' },
                          { label: 'Closed', value: 'closed' },
                        ]}
                        stroke="dropdown.icon"
                        variant="secondaryVariant"
                      />
                    </GridItem>
                  )}
                  <GridItem>
                    {questionsCategory?.options && (
                      <Stack>
                        {questionsCategory.options.map(({ name, value }) => (
                          <Toggle
                            control={control}
                            disabled={isDisabled}
                            falseLabel={name}
                            key={name}
                            name={`options[${value}]`}
                            trueLabel={name}
                          />
                        ))}
                      </Stack>
                    )}
                  </GridItem>
                </Grid>
                <Stack>
                  {isUserPermittedToModify && !isDisabled && (
                    <>
                      <Text fontSize="11px" fontWeight="700" mb={2}>
                        Add photos or files
                      </Text>
                      <DocumentUpload
                        callback={async (uploaded) => appendAttachment(uploaded)}
                        elementId={walkItem?._id || `temp-${question?._id}`}
                      />
                    </>
                  )}
                  {values.attachments?.map((attachment, i) => (
                    <Flex flexDir="column" key={i} mb={2}>
                      <DocumentUploaded
                        callback={async () => removeAttachment(i)}
                        document={attachment}
                        downloadable
                        removable={!isDisabled}
                      />
                    </Flex>
                  ))}
                  {values.attachments?.length === 0 && !isUserPermittedToModify && <Text fontSize="sm">No uploaded attachments</Text>}
                </Stack>

                {Array.isArray(walkItem?.actions) && walkItem!.actions!.length > 0 && (
                  <Stack spacing={4}>
                    <Text fontSize="smm" fontWeight="semibold">
                      Actions
                    </Text>
                    {walkItem?.actions?.map((action, index) => (
                      <ActionListItem action={action} disabled index={index} key={action._id} />
                    ))}
                  </Stack>
                )}
              </Stack>
            </Stack>
            <Flex flexBasis="calc(40px + 1rem)" flexShrink={0} justify="space-between" pt={4} w="full">
              {walkItem?.audit?.status !== 'completed' && (
                <Button
                  bg="walkItemModal.buttons.secondary.bg"
                  color="walkItemModal.buttons.secondary.color"
                  fontSize="smm"
                  fontWeight="700"
                  h="40px"
                  ml={3}
                  onClick={handleDeleteQuestionModalOpen}
                  rounded="10px"
                  w="fit-content"
                >
                  Delete
                </Button>
              )}
              <Spacer />
              {isUserPermittedToModifyStatus &&
                (walkItem?.audit?.status.toString() === 'upcoming' ||
                  (walkItem?.audit?.status.toString() !== 'upcoming' && walkItem?.question?.questionsCategory?.useStatus)) && (
                  <Button
                    bg="walkItemModal.buttons.primary.bg"
                    color="walkItemModal.buttons.primary.color"
                    disabled={!isValid}
                    fontSize="smm"
                    fontWeight="700"
                    h="40px"
                    ml={3}
                    onClick={handlePrimaryButtonClick}
                    rightIcon={<Icon as={TickIcon} size={24} stroke="walkItemModal.buttons.primary.icon" />}
                    rounded="10px"
                    w="fit-content"
                  >
                    Update
                  </Button>
                )}
            </Flex>
          </Stack>
        </ModalBody>
      </ModalContent>
    </>
  );
};

export default WalkItemModal;

export const walkItemModalStyles = {
  walkItemModal: {
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
