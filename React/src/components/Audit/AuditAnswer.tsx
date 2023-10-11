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

function AuditAnswer({ question, handleClose }: { question: TDeepPartial<TQuestionWithAnswer>; handleClose: () => void }) {
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
    (<Stack
      bgColor="auditAnswer.bg"
      boxShadow="0px 0px 30px 0px #31323340"
      data-id="213f708c658e"
      h={['full', 'auto']}
      p={4}
      rounded="10px"
      spacing={4}>
      <Text data-id="bb2f2eae3880" fontSize="md" fontWeight="semibold">
        {questionsCategory.name}
      </Text>
      {audit.auditType?.businessUnitScope === 'answer' && (
        <Dropdown
          control={control}
          data-id="9210fc07b4a0"
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
          variant="secondaryVariant" />
      )}
      <Dropdown
        control={control}
        data-id="7d0ad008b3c8"
        disabled={isDisabled}
        label="Category"
        name="categoryId"
        options={(categories ?? []).map((category) => ({
          value: category._id,
          label: category.name,
        }))}
        placeholder="Select category"
        stroke="dropdown.icon"
        variant="secondaryVariant" />
      <Stack data-id="36e3523a5d2d">
        {questionsCategory.withAnswers ? (
          <Stack data-id="f8c18bd90db1">
            {isCustomQuestion ? (
              <TextInput
                control={control}
                data-id="3e8cab6e01fd"
                disabled={isDisabled}
                label="Question"
                name="question"
                required
                validations={{
                  notEmpty: true,
                }} />
            ) : (
              <Text data-id="ca1db33dc797">{question.question}</Text>
            )}
            <TextInputMultiline
              control={control}
              data-id="60d72db6b0dc"
              disabled={isDisabled}
              label="Answer"
              name="answer"
              required
              validations={{
                notEmpty: true,
              }} />
          </Stack>
        ) : (
          <TextInputMultiline
            control={control}
            data-id="120471970bf6"
            disabled={isDisabled}
            label="Description"
            name="question"
            required
            validations={{
              notEmpty: true,
            }} />
        )}
      </Stack>
      {questionsCategory.options && (
        <Stack data-id="1ec13133d344">
          {questionsCategory.options.map(({ name, setting }) => (
            <Toggle
              control={control}
              data-id="7893a1f22b9b"
              disabled={isDisabled}
              falseLabel={name}
              key={setting}
              name={`options[${setting}]`}
              trueLabel={name} />
          ))}
        </Stack>
      )}
      <Stack data-id="53690979d760">
        <Text data-id="3ff41bd2e1e6" fontSize="ssm" fontWeight="bold" mb={2}>
          Attachments
        </Text>
        {!isDisabled && (
          <DocumentUpload
            callback={async (uploaded) => appendAttachment(uploaded)}
            data-id="dffabd5e9ea6"
            elementId={answer?._id || `temp-${question._id}`}
            setUploadStatus={setUploading} />
        )}
        {values.attachments?.map((attachment, i) => (
          <Flex data-id="75d3583bf9b5" flexDir="column" key={i} mb={2}>
            <DocumentUploaded
              callback={async () => removeAttachment(i)}
              data-id="136e690de3c4"
              document={attachment}
              downloadable
              removable={!isDisabled} />
          </Flex>
        ))}
        {values.attachments?.length === 0 && isDisabled && <Text data-id="4f95b34c870b" fontSize="sm">No uploaded attachments</Text>}
      </Stack>
      <Stack data-id="b7f4cf0e5422" spacing={4}>
        <Text data-id="8020c5997e70" fontSize="ssm" fontWeight="bold">
          Actions
        </Text>
        {values.actions?.length === 0 && isDisabled && <Text data-id="77fc233e87bb" fontSize="sm">No actions</Text>}
        {selectedAction ? (
          <AuditActionForm
            data-id="cd25fe98e4bb"
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
                      status: action.status,
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
            }} />
        ) : (
          <Stack data-id="03f2a65cd0da">
            {values.actions?.map((action, index) => (
              <ActionListItem
                action={action}
                data-id="f97829d8477d"
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
                }} />
            ))}

            {!isDisabled && (
              <Button
                bgColor="auditAnswer.buttons.addAction.bg"
                color="auditAnswer.buttons.addAction.color"
                data-id="393f9d66aeb3"
                fontSize="ssm"
                fontWeight="semibold"
                h="28px"
                onClick={() => setSelectedAction({})}
                rounded="10px"
                w="fit-content">
                Add action
              </Button>
            )}
          </Stack>
        )}
      </Stack>
      <HStack data-id="a6b4a1f1a420">
        <Button
          bgColor="auditAnswer.buttons.cancel.bg"
          color="auditAnswer.buttons.cancel.color"
          data-id="d944bd638340"
          fontSize="smm"
          fontWeight="semibold"
          h="40px"
          onClick={handleClose}
          rounded="10px">
          {isDisabled ? 'Close' : 'Cancel'}
        </Button>
        <Spacer data-id="a9a48024fa85" />
        {!isDisabled && (
          <Button
            bgColor="auditAnswer.buttons.save.bg"
            color="auditAnswer.buttons.save.color"
            data-id="459f339a752a"
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
            rightIcon={<CheckIcon data-id="1e6b4b0a3c37" stroke="auditAnswer.buttons.save.color" />}
            rounded="10px">
            Save
          </Button>
        )}
      </HStack>
    </Stack>)
  );
}

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
