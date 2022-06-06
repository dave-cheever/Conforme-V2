import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button, Flex, HStack, Spacer, Stack, Text, useToast } from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';

import { toastFailed } from '../../bootstrap/config';
import { TQuestionWithAnswer, useAuditContext } from '../../contexts/AuditProvider';
import { CheckIcon } from '../../icons';
import { TDeepPartial } from '../../interfaces/TDeepPartial';
import ActionListItem from '../Actions/ActionListItem';
import DocumentUpload from '../Documents/DocumentUpload';
import DocumentUploaded from '../Documents/DocumentUploaded';
import { TextInput, Toggle } from '../Forms';
import TextInputMultiline from '../Forms/TextInputMultiline';
import AuditActionForm from './AuditActionForm';

const AuditAnswer = ({ question, handleClose }: { question: TDeepPartial<TQuestionWithAnswer>; handleClose: () => void }) => {
  const toast = useToast();
  const {
    audit,
    questionsCategories,
    createQuestion,
    saveQuestion,
    createAnswer,
    saveAnswer,
    updateActions,
    selectedAction,
    setSelectedAction,
    refetch,
  } = useAuditContext();
  const questionsCategory = questionsCategories.find(({ _id }) => _id === question.questionsCategoryId);
  const isCustomQuestion = !!question.scope?._id; // If there is no scope _id, it means that the question is a custom one
  const { answer } = question;

  const { control, formState, watch, reset, setValue } = useForm({
    mode: 'all',
  });
  const { isValid } = formState;
  const values = watch();

  useEffect(() => {
    reset({
      question: question.question || '',
      options: answer?.options || {},
      attachments: answer?.attachments || [],
      answer: answer?.answer || '',
      actions: answer?.actions || [],
    });
  }, [JSON.stringify(question)]);

  const saveData = async () => {
    const questionData = {
      _id: question._id,
      question: values.question,
    };

    const answerData = {
      _id: question.answer?._id,
      options: values.options,
      answer: values.answer,
      attachments: values.attachments.map((attachment) => ({
        id: attachment.id,
        name: attachment.name,
        addedAt: attachment.addedAt,
      })),
    };

    try {
      let answerId = answer?._id;
      if (answerId) {
        // Answer already exist, needs to be updated
        if (isCustomQuestion) await saveQuestion({ variables: { question: questionData } });
        await saveAnswer({ variables: { answer: answerData } });
      } else {
        // Answer does not exist, needs to be created
        let questionId = question._id;
        if (isCustomQuestion) {
          const { _id, ...questionValues } = questionData;
          const createdQuestionRes = await createQuestion({
            variables: {
              question: {
                ...questionValues,
                type: question.type,
                questionsCategoryId: question.questionsCategoryId,
                scope: {
                  type: 'audit',
                  _id: audit?._id,
                },
              },
            },
          });
          const createdQuestion = createdQuestionRes.data.createQuestion;
          questionId = createdQuestion._id;
        }

        const createdAnswerRes = await createAnswer({
          variables: {
            answer: {
              ...answer,
              questionId,
              scope: {
                type: 'audit',
                _id: audit?._id,
              },
            },
          },
        });
        const createdAnswer = createdAnswerRes.data.createAnswer;
        answerId = createdAnswer._id;
      }
      if (answerId) await updateActions(values.actions, answerId);
      refetch();
      handleClose();
    } catch (e: any) {
      toast({
        ...toastFailed,
        description: e.message,
      });
    }
  };

  if (!questionsCategory) return null;
  const isDisabled = !!(audit.status === 'completed' && (questionsCategory.notBlockedAfterCompletion ? !!answer?._id : true));
  return (
    <Stack bgColor="auditAnswer.bg" boxShadow="0px 0px 30px 0px #31323340" p={4} rounded="10px" spacing={4}>
      <Text fontSize="md" fontWeight="semibold">
        {questionsCategory.name}
      </Text>
      <Stack>
        {questionsCategory.withAnswers ? (
          <Stack>
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
              <Text>{question.question}</Text>
            )}
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
          </Stack>
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
      </Stack>
      {questionsCategory.options && (
        <Stack>
          {questionsCategory.options.map(({ name }) => (
            <Toggle control={control} disabled={isDisabled} falseLabel={name} key={name} name={`options[${name}]`} trueLabel={name} />
          ))}
        </Stack>
      )}
      <Stack w="360px">
        <Text fontSize="11px" fontWeight="700" mb={2}>
          Attachments
        </Text>
        {!isDisabled && (
          <DocumentUpload
            callback={async (uploaded) => {
              setValue('attachments', [...values.attachments, ...uploaded]);
            }}
            elementId={answer?._id || `temp-${question._id}`}
          />
        )}
        {values.attachments?.map((attachment, i) => (
          <Flex flexDir="column" key={i} mb={2}>
            <DocumentUploaded
              callback={async () => {
                setValue(
                  'attachments',
                  values.attachments.filter(({ id }) => id !== attachment.id),
                );
              }}
              document={attachment}
              downloadable
              removable={!isDisabled}
            />
          </Flex>
        ))}
        {values.attachments?.length === 0 && isDisabled && <Text fontSize="sm">No uploaded attachments</Text>}
      </Stack>
      {!isDisabled && (
        <Stack spacing={4}>
          <Text fontSize="smm" fontWeight="semibold">
            Actions
          </Text>
          {selectedAction ? (
            <AuditActionForm
              handleSave={(action) => {
                if (!action._id) setValue('actions', [...values.actions, { ...action, _id: `temp-${uuidv4()}` }]);
                else {
                  const actionIndex = values.actions.findIndex(({ _id }) => _id === action._id);
                  const actions = [...values.actions];
                  actions[actionIndex] = action;
                  setValue('actions', actions);
                }
              }}
            />
          ) : (
            <Stack>
              {values.actions?.map((action, index) => (
                <ActionListItem
                  action={action}
                  disabled={isDisabled}
                  index={index}
                  key={action._id}
                  onDelete={() =>
                    setValue(
                      'actions',
                      values.actions.filter((a, i) => i !== index),
                    )
                  }
                />
              ))}

              <Button
                bgColor="auditAnswer.buttons.addAction.bg"
                color="auditAnswer.buttons.addAction.color"
                fontSize="ssm"
                fontWeight="semibold"
                h="28px"
                onClick={() => setSelectedAction({})}
                rounded="10px"
                w="fit-content"
              >
                Add action
              </Button>
            </Stack>
          )}
        </Stack>
      )}
      <HStack>
        <Button
          bgColor="auditAnswer.buttons.cancel.bg"
          color="auditAnswer.buttons.cancel.color"
          fontSize="smm"
          fontWeight="semibold"
          h="40px"
          onClick={handleClose}
          rounded="10px"
        >
          {isDisabled ? 'Close' : 'Cancel'}
        </Button>
        <Spacer />
        {!isDisabled && (
          <Button
            bgColor="auditAnswer.buttons.save.bg"
            color="auditAnswer.buttons.save.color"
            disabled={!isValid}
            fontSize="smm"
            fontWeight="semibold"
            h="40px"
            onClick={saveData}
            rightIcon={<CheckIcon stroke="auditAnswer.buttons.save.color" />}
            rounded="10px"
          >
            Save
          </Button>
        )}
      </HStack>
    </Stack>
  );
};

export const auditAnswerStyles = {
  auditAnswer: {
    bg: '#fff',
    buttons: {
      addAction: {
        bg: '#DC0043',
        color: '#fff',
      },
      cancel: {
        bg: '#F4F3F5',
        color: '#787486',
      },
      save: {
        bg: '#DC0043',
        color: '#fff',
      },
    },
  },
};

export default AuditAnswer;
