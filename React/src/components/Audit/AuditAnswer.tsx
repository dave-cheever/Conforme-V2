import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button, Flex, HStack, Spacer, Stack, Text } from '@chakra-ui/react';

import {
  TQuestionWithAnswer,
  useAuditContext,
} from '../../contexts/AuditProvider';
import { CheckIcon } from '../../icons';
import { TDeepPartial } from '../../interfaces/TDeepPartial';
import DocumentUpload from '../Documents/DocumentUpload';
import DocumentUploaded from '../Documents/DocumentUploaded';
import { TextInput, Toggle } from '../Forms';
import TextInputMultiline from '../Forms/TextInputMultiline';

const AuditAnswer = ({
  question,
  handleClose,
}: {
  question: TDeepPartial<TQuestionWithAnswer>;
  handleClose: () => void;
}) => {
  const {
    questionsCategories,
    createCustomQuestionAndAnswer,
    saveCustomQuestionAndAnswer,
  } = useAuditContext();
  const questionsCategory = questionsCategories.find(
    ({ _id }) => _id === question.questionsCategoryId,
  );
  const isCustomQuestion = !!question.scope?._id;
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
    });
  }, [question]);

  if (!questionsCategory) return null;
  return (
    <Stack
      bgColor="auditAnswer.bg"
      boxShadow="0px 0px 30px 0px #31323340"
      p={4}
      rounded="10px"
      spacing={4}
    >
      <Text fontSize="md" fontWeight="semibold">
        {questionsCategory.name}
      </Text>
      <Stack>
        {questionsCategory.withAnswers ? (
          <Stack>
            {isCustomQuestion ? (
              <TextInput
                control={control}
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
            <Toggle
              control={control}
              falseLabel={name}
              key={name}
              name={`options[${name}]`}
              trueLabel={name}
            />
          ))}
        </Stack>
      )}
      <Stack w="360px">
        <Text fontSize="11px" fontWeight="700" mb={2}>
          Attachments
        </Text>
        <DocumentUpload
          callback={async (uploaded) => {
            setValue('attachments', [...values.attachments, ...uploaded]);
          }}
          elementId={answer?._id || `temp-${question._id}`}
        />
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
              removable
            />
          </Flex>
        ))}
      </Stack>
      <Stack spacing={4}>
        <Text fontSize="smm" fontWeight="semibold">
          Actions
        </Text>
        <Button
          bgColor="auditAnswer.buttons.addAction.bg"
          color="auditAnswer.buttons.addAction.color"
          fontSize="ssm"
          fontWeight="semibold"
          h="28px"
          rounded="10px"
          w="fit-content"
        >
          Add action
        </Button>
      </Stack>
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
          Cancel
        </Button>
        <Spacer />
        <Button
          bgColor="auditAnswer.buttons.save.bg"
          color="auditAnswer.buttons.save.color"
          disabled={!isValid}
          fontSize="smm"
          fontWeight="semibold"
          h="40px"
          onClick={() => {
            const questionWithAnswer: TDeepPartial<TQuestionWithAnswer> = {
              _id: question._id,
              answer: {
                _id: question.answer?._id,
                options: values.options,
                answer: values.answer,
                attachments: values.attachments.map((attachment) => ({
                  id: attachment.id,
                  name: attachment.name,
                  addedAt: attachment.addedAt,
                })),
              },
              question: values.question,
            };
            if (answer?._id) saveCustomQuestionAndAnswer(questionWithAnswer);
            else {
              createCustomQuestionAndAnswer({
                ...questionWithAnswer,
                type: question.type,
                questionsCategoryId: question.questionsCategoryId,
              });
            }

            handleClose();
          }}
          rightIcon={<CheckIcon stroke="auditAnswer.buttons.save.color" />}
          rounded="10px"
        >
          Save
        </Button>
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
