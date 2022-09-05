import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { gql, useMutation, useQuery } from '@apollo/client';
import { useDisclosure, useToast } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';

import useNavigate from '../hooks/useNavigate';
import { IAction } from '../interfaces/IAction';
import { IAnswer } from '../interfaces/IAnswer';
import { IAuditContext } from '../interfaces/IAuditContext';
import { IQuestion } from '../interfaces/IQuestion';
import { TDeepPartial } from '../interfaces/TDeepPartial';

export const AuditContext = createContext({} as IAuditContext);

const GET_AUDIT = gql`
  query GetAudit($auditQueryInput: AuditQueryInput) {
    audits(auditQueryInput: $auditQueryInput) {
      _id
      auditTypeId
      walkType
      reference
      status
      auditorId
      participantsIds
      recurring
      auditType {
        _id
        name
        sections {
          type
          _id
        }
      }
      location {
        _id
        name
      }
      businessUnit {
        _id
        name
      }
      auditor {
        _id
        displayName
        imgUrl
        email
        jobTitle
      }
      participants {
        _id
        displayName
        imgUrl
        email
        jobTitle
      }
    }
  }
`;
const GET_AUDIT_DATA = gql`
  query GetAuditData(
    $questionsCategoryQuery: QuestionsCategoryQuery
    $auditTypeQuestionQuery: QuestionQuery
    $auditCustomQuestionQuery: QuestionQuery
  ) {
    questionsCategories(questionsCategoryQuery: $questionsCategoryQuery) {
      _id
      name
      withAnswers
      allowCustomQuestions
      maxQuestionsNumber
      notBlockedAfterCompletion
      icon
      options {
        type
        name
        value
      }
    }
    auditTypeQuestions: questions(questionQuery: $auditTypeQuestionQuery) {
      _id
      question
      questionsCategory {
        useStatus
      }
      answer {
        _id
        answer
        status
        attachments {
          id
          name
          addedAt
          thumbnail
        }
        options
        metatags {
          updatedAt
        }
        actions {
          _id
          title
          dueDate
          priority
          description
          assigneeId
          assignor {
            displayName
            imgUrl
          }
          metatags {
            addedAt
            removedAt
          }
        }
      }
      questionsCategoryId
      scope {
        module
        moduleId
        type
        _id
      }
    }
    auditCustomQuestions: questions(questionQuery: $auditCustomQuestionQuery) {
      _id
      question
      questionsCategory {
        useStatus
      }
      answer {
        _id
        answer
        status
        attachments {
          id
          name
          addedAt
          thumbnail
        }
        options
        metatags {
          updatedAt
        }
        actions {
          _id
          title
          dueDate
          priority
          description
          assigneeId
          assignor {
            displayName
            imgUrl
          }
          metatags {
            addedAt
            removedAt
          }
        }
      }
      questionsCategoryId
      scope {
        module
        moduleId
        type
        _id
      }
    }
  }
`;
const UPDATE_AUDIT = gql`
  mutation UpdateAudit($audit: AuditModifyInput!) {
    updateAudit(auditInput: $audit) {
      _id
    }
  }
`;
const SUBMIT_AUDIT = gql`
  mutation SubmitAudit($auditId: ID!) {
    submitAudit(auditId: $auditId)
  }
`;
const DELETE_AUDIT = gql`
  mutation DeleteAudit($_id: String!) {
    deleteAudit(_id: $_id)
  }
`;
const ADD_QUESTION = gql`
  mutation AddQuestion($question: QuestionCreateInput!) {
    createQuestion(question: $question) {
      _id
    }
  }
`;
const SAVE_QUESTION = gql`
  mutation SaveQuestion($question: QuestionModifyInput!) {
    updateQuestion(questionInput: $question) {
      _id
    }
  }
`;
const DELETE_QUESTION = gql`
  mutation ($_id: ID!) {
    deleteQuestion(_id: $_id)
  }
`;
const ADD_ANSWER = gql`
  mutation AddAnswer($answer: AnswerCreateInput!) {
    createAnswer(answer: $answer) {
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
const DELETE_ANSWER = gql`
  mutation ($_id: ID!) {
    deleteAnswer(_id: $_id)
  }
`;
const ADD_ACTION = gql`
  mutation AddAction($action: ActionCreateInput!) {
    createAction(action: $action) {
      _id
    }
  }
`;
const SAVE_ACTION = gql`
  mutation SaveAction($action: ActionModifyInput!) {
    updateAction(actionInput: $action) {
      _id
    }
  }
`;
const DELETE_ACTION = gql`
  mutation ($_id: ID!) {
    deleteAction(_id: $_id)
  }
`;

export type TQuestionWithAnswer = IQuestion<any> & {
  answer: IAnswer;
};

export interface IQuestionsByCategories {
  [categoryId: string]: TQuestionWithAnswer[];
}

export const useAuditContext = () => {
  const context = useContext(AuditContext);
  if (!context) throw new Error('useAuditContext must be used within the AuditProvider');

  return context;
};

const AuditProvider = ({ children }) => {
  const toast = useToast();
  const { id }: { id: string } = useParams();
  const { navigateTo } = useNavigate();

  const [updateAudit] = useMutation(UPDATE_AUDIT);
  const [submitAudit] = useMutation(SUBMIT_AUDIT);
  const [deleteAudit] = useMutation(DELETE_AUDIT);

  const [createQuestion] = useMutation(ADD_QUESTION);
  const [saveQuestion] = useMutation(SAVE_QUESTION);
  const [deleteQuestion] = useMutation(DELETE_QUESTION);

  const [createAnswer] = useMutation(ADD_ANSWER);
  const [saveAnswer] = useMutation(SAVE_ANSWER);
  const [deleteAnswer] = useMutation(DELETE_ANSWER);

  const [createAction] = useMutation(ADD_ACTION);
  const [saveAction] = useMutation(SAVE_ACTION);
  const [deleteAction] = useMutation(DELETE_ACTION);

  const [selectedQuestion, setSelectedQuestion] = useState<TDeepPartial<TQuestionWithAnswer>>();
  const [selectedAction, setSelectedAction] = useState<Partial<IAction>>();
  const [actionChangesModalOnContinue, setActionChangesModalOnContinue] = useState<Function>();
  const { isOpen: isOpenMessage, onOpen: handleOpenMessage, onClose: handleCloseMessage } = useDisclosure();

  const {
    isOpen: isActionChangesModalOpen,
    onClose: handleActionChangesModalClose,
    onOpen: handleActionChangesModalOpen,
  } = useDisclosure();

  const {
    data,
    loading,
    error,
    refetch: refetchAudit,
  } = useQuery(GET_AUDIT, {
    variables: { auditQueryInput: { _id: id } },
  });

  const audit = data?.audits[0];
  const auditType = audit?.auditType;
  const location = audit?.location;
  const businessUnit = audit?.businessUnit;
  const auditor = audit?.auditor;
  const participants = audit?.participants;

  const { data: auditData, refetch: refetchAuditData } = useQuery(GET_AUDIT_DATA, {
    variables: {
      questionsCategoryQuery: {
        _ids: auditType?.sections.map(({ _id }) => _id),
      },
      auditTypeQuestionQuery: {
        questionsCategoriesIds: auditType?.sections.map(({ _id }) => _id),
        scope: { module: 'audits' },
      },
      auditCustomQuestionQuery: { scope: { type: 'audit', _id: audit?._id } },
    },
    skip: !audit,
  });

  // Save questions categories in the same order as defined in audit type
  const questionsCategories = useMemo(() => {
    if (!auditData || !auditType?.sections) return [];

    return auditType?.sections?.map(({ _id }) => auditData?.questionsCategories?.find(({ _id: categoryId }) => categoryId === _id));
  }, [JSON.stringify(auditData), JSON.stringify(auditType)]);

  const customQuestionsCategories = useMemo(
    () => questionsCategories.filter((category) => category.allowCustomQuestions),
    [questionsCategories],
  );

  // Group (custom and predefined) questions by category
  const questions: IQuestionsByCategories = useMemo(() => {
    if (!auditData?.auditCustomQuestions && !auditData?.auditTypeQuestions) return {};

    const questionsByCategories: IQuestionsByCategories = {};

    auditData.auditTypeQuestions?.forEach((question) => {
      if (!questionsByCategories[question.questionsCategoryId]) questionsByCategories[question.questionsCategoryId] = [];
      questionsByCategories[question.questionsCategoryId].push(question);
    });

    auditData.auditCustomQuestions?.forEach((question) => {
      if (!questionsByCategories[question.questionsCategoryId]) questionsByCategories[question.questionsCategoryId] = [];
      questionsByCategories[question.questionsCategoryId].push(question);
    });

    return questionsByCategories;
  }, [JSON.stringify(auditData)]);

  useEffect(() => {
    if (!loading && error) {
      toast({
        title: `${capitalize(t('audit'))} not found`,
        description: `${capitalize(t('audit'))} does not exist`,
      });
      navigateTo('/');
    }
  }, [error]);

  const refetch = async () => {
    await refetchAudit();
    await refetchAuditData();
  };

  const value = useMemo(
    () => ({
      audit,
      auditType,
      auditor,
      participants,
      location,
      businessUnit,
      questionsCategories,
      customQuestionsCategories,
      questions,
      loading,
      isActionChangesModalOpen,
      isOpenMessage,
      handleOpenMessage,
      handleCloseMessage,
      handleActionChangesModalClose,
      handleActionChangesModalOpen,
      actionChangesModalOnContinue,
      setActionChangesModalOnContinue,
      selectedQuestion,
      setSelectedQuestion,
      selectedAction,
      setSelectedAction,
      createQuestion,
      saveQuestion,
      deleteQuestion,
      createAnswer,
      saveAnswer,
      deleteAnswer,
      createAction,
      saveAction,
      deleteAction,
      updateAudit,
      submitAudit,
      deleteAudit,
      refetch,
    }),
    [
      audit,
      auditType,
      auditor,
      participants,
      location,
      businessUnit,
      questions,
      loading,
      selectedQuestion,
      selectedAction,
      isActionChangesModalOpen,
      actionChangesModalOnContinue,
      isOpenMessage,
    ],
  );

  return <AuditContext.Provider value={value}>{children}</AuditContext.Provider>;
};

export default AuditProvider;
