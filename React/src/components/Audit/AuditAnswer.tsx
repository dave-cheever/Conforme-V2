import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { Button, Flex, HStack, Spacer, Stack, Text, useToast } from '@chakra-ui/react';
import { endOfDay } from 'date-fns';
import { t } from 'i18next';
import { capitalize } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import { toastFailed, toastSuccess } from '../../bootstrap/config';
import { useAppContext } from '../../contexts/AppProvider';
import { TQuestionWithAnswer, useAuditContext } from '../../contexts/AuditProvider';
import { CheckIcon } from '../../icons';
import { IAction } from '../../interfaces/IAction';
import { TDeepPartial } from '../../interfaces/TDeepPartial';
import ActionListItem from '../Actions/ActionListItem';
import { isPermitted } from '../can';
import DocumentUpload from '../Documents/DocumentUpload';
import DocumentUploaded from '../Documents/DocumentUploaded';
import { Dropdown, TextInput, Toggle } from '../Forms';
import TextInputMultiline from '../Forms/TextInputMultiline';
import AuditActionForm from './AuditActionForm';

const AuditAnswer = ({ question, handleClose }: { question: TDeepPartial<TQuestionWithAnswer>; handleClose: () => void }) => {
  const toast = useToast();
  const { user, module } = useAppContext();
  const {
    businessUnits,
    categories,
    audit,
    handleActionChangesModalOpen,
    questionsCategories,
    createQuestion,
    saveQuestion,
    createAnswer,
    saveAnswer,
    createAction,
    saveAction,
    deleteAction,
    selectedAction,
    setSelectedAction,
    setActionChangesModalOnContinue,
    refetch,
  } = useAuditContext();
  const questionsCategory = questionsCategories.find(({ _id }) => _id === question.questionsCategoryId);
  const isCustomQuestion = !!question.scope?._id; // If there is no scope _id, it means that the question is a custom one
  const { answer } = question;
  const isUserPermittedToModify = isPermitted({ user, action: 'audits.edit', data: { audit } });
  const [uploading, setUploading] = useState(false);

  const { control, formState, watch, reset, setValue } = useForm({
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
      businessUnitId: answer?.businessUnitId,
      categoryId: question.categoryId || '',
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
      categoryId: values.categoryId,
    };

    const answerData = {
      _id: question.answer?._id,
      businessUnitId: values.businessUnitId,
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
        // Answer does not exist
        let questionId = question._id;
        if (isCustomQuestion) {
          // Create a question if it is custom
          const { _id, ...questionValues } = questionData;
          const createdQuestionRes = await createQuestion({
            variables: {
              question: {
                ...questionValues,
                type: question.type,
                questionsCategoryId: question.questionsCategoryId,
                scope: {
                  moduleId: module?._id,
                  type: 'audit',
                  _id: audit?._id,
                },
              },
            },
          });
          const createdQuestion = createdQuestionRes.data.createQuestion;
          questionId = createdQuestion._id;
        }

        // Create answer
        const createdAnswerRes = await createAnswer({
          variables: {
            answer: {
              ...answer,
              ...answerData,
              questionId,
              scope: {
                moduleId: module?._id,
                type: 'audit',
                _id: audit?._id,
              },
            },
          },
        });
        const createdAnswer = createdAnswerRes.data.createAnswer;
        answerId = createdAnswer._id;

        // Create actions
        await Promise.all(
          values.actions.map(async (action: Partial<IAction>) => {
            await createAction({
              variables: {
                action: {
                  title: action.title,
                  dueDate: action.dueDate ? endOfDay(action.dueDate) : null,
                  status: 'open',
                  priority: action.priority,
                  description: action.description,
                  assigneeId: action.assigneeId,
                  scope: {
                    moduleId: module?._id,
                    type: 'answer',
                    _id: answerId,
                  },
                },
              },
            });
          }),
        );
      }
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
  const isDisabled =
    !!(audit.status === 'completed' && (questionsCategory.notBlockedAfterCompletion ? !!answer?._id : true)) || !isUserPermittedToModify;

  return (
    <Stack bgColor="auditAnswer.bg" boxShadow="0px 0px 30px 0px #31323340" h={['full', 'auto']} p={4} rounded="10px" spacing={4}>
      <Text fontSize="md" fontWeight="semibold">
        {questionsCategory.name}
      </Text>
      {audit.auditType?.businessUnitScope === 'answer' && (
        <Dropdown
          control={control}
          disabled={isDisabled}
          label={capitalize(t('business unit'))}
          name="businessUnitId"
          options={(businessUnits ?? []).map((businessUnit) => ({
            value: businessUnit._id,
            label: businessUnit.name,
          }))}
          placeholder={`Select ${capitalize(t('business unit'))}`}
          required
          stroke="dropdown.icon"
          validations={{
            notEmpty: true,
          }}
          variant="secondaryVariant"
        />
      )}
      <Dropdown
        control={control}
        disabled={isDisabled}
        label="Category"
        name="categoryId"
        options={(categories ?? []).map((category) => ({
          value: category._id,
          label: category.name,
        }))}
        placeholder="Select category"
        stroke="dropdown.icon"
        variant="secondaryVariant"
      />
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
          {questionsCategory.options.map(({ name, value }) => (
            <Toggle control={control} disabled={isDisabled} falseLabel={name} key={value} name={`options[${value}]`} trueLabel={name} />
          ))}
        </Stack>
      )}
      <Stack>
        <Text fontSize="ssm" fontWeight="bold" mb={2}>
          Attachments
        </Text>
        {!isDisabled && (
          <DocumentUpload
            callback={async (uploaded) => appendAttachment(uploaded)}
            elementId={answer?._id || `temp-${question._id}`}
            setUploadStatus={setUploading}
          />
        )}
        {values.attachments?.map((attachment, i) => (
          <Flex flexDir="column" key={i} mb={2}>
            <DocumentUploaded callback={async () => removeAttachment(i)} document={attachment} downloadable removable={!isDisabled} />
          </Flex>
        ))}
        {values.attachments?.length === 0 && isDisabled && <Text fontSize="sm">No uploaded attachments</Text>}
      </Stack>

      <Stack spacing={4}>
        <Text fontSize="ssm" fontWeight="bold">
          Actions
        </Text>
        {values.actions?.length === 0 && isDisabled && <Text fontSize="sm">No actions</Text>}
        {selectedAction ? (
          <AuditActionForm
            handleSave={async (action) => {
              // If action doesn't exist, needs to be created
              if (!action._id) {
                let createdActionId = `temp-${uuidv4()}`;
                if (answer) {
                  const actionResponse = await createAction({
                    variables: {
                      action: {
                        title: action.title,
                        dueDate: action.dueDate ? endOfDay(action.dueDate) : null,
                        status: 'open',
                        priority: action.priority,
                        description: action.description,
                        assigneeId: action.assigneeId,
                        scope: {
                          moduleId: module?._id,
                          type: 'answer',
                          _id: answer?._id,
                        },
                      },
                    },
                  });
                  createdActionId = actionResponse.data?.createAction._id;
                }
                toast({
                  ...toastSuccess,
                  description: 'Action created',
                });
                setValue('actions', [...values.actions, { ...action, _id: createdActionId }]);
              } else {
                await saveAction({
                  variables: {
                    action: {
                      _id: action._id,
                      title: action.title,
                      dueDate: action.dueDate ? endOfDay(action.dueDate) : null,
                      priority: action.priority,
                      description: action.description,
                      assigneeId: action.assigneeId,
                    },
                  },
                });
                toast({
                  ...toastSuccess,
                  description: 'Action updated',
                });
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
                onDelete={async () => {
                  const deletedAction = await deleteAction({
                    variables: {
                      _id: action._id,
                    },
                  });
                  if (deletedAction.data?.deleteAction) {
                    toast({
                      ...toastSuccess,
                      description: 'Action deleted',
                    });
                    setValue(
                      'actions',
                      values.actions.filter((a, i) => i !== index),
                    );
                  }
                }}
              />
            ))}

            {!isDisabled && (
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
            )}
          </Stack>
        )}
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
          {isDisabled ? 'Close' : 'Cancel'}
        </Button>
        <Spacer />
        {!isDisabled && (
          <Button
            bgColor="auditAnswer.buttons.save.bg"
            color="auditAnswer.buttons.save.color"
            disabled={!isValid || uploading}
            fontSize="smm"
            fontWeight="semibold"
            h="40px"
            onClick={
              selectedAction
                ? () => {
                    setActionChangesModalOnContinue(() => saveData);
                    handleActionChangesModalOpen();
                  }
                : saveData
            }
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
