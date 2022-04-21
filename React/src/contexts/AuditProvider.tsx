import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { gql, useMutation, useQuery } from '@apollo/client';
import { useToast } from '@chakra-ui/react';

import useNavigate from '../hooks/useNavigate';
import { IAnswer } from '../interfaces/IAnswer';
import { IAuditContext } from '../interfaces/IAuditContext';
import { IQuestion } from '../interfaces/IQuestion';
import { TDeepPartial } from '../interfaces/TDeepPartial';

export const AuditContext = createContext({} as IAuditContext);

const GET_AUDIT = gql`
  query GetAudit($auditQueryInput: AuditQueryInput) {
    audits(auditQueryInput: $auditQueryInput) {
      _id
      walkType
      reference
      status
      auditorId
      participantsIds
      auditType {
        _id
        name
        sections {
          type
          _id
        }
      }
      site {
        _id
        name
      }
      area {
        _id
        name
      }
      auditor {
        _id
        displayName
      }
      participants {
        _id
        displayName
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
      icon
      options {
        name
      }
    }
    auditTypeQuestions: questions(questionQuery: $auditTypeQuestionQuery) {
      _id
      question
      answer {
        _id
        answer
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
      }
      questionsCategoryId
      scope {
        component
        type
        _id
      }
    }
    auditCustomQuestions: questions(questionQuery: $auditCustomQuestionQuery) {
      _id
      question
      answer {
        _id
        answer
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
      }
      questionsCategoryId
      scope {
        component
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
const ADD_QUESTION = gql`
  mutation AddQuestion($question: QuestionCreateInput!) {
    createQuestion(question: $question) {
      _id
      question
      questionsCategoryId
      scope {
        component
        type
        _id
      }
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
      answer
      attachments {
        id
        name
        addedAt
      }
      options
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

export type TQuestionWithAnswer = IQuestion<any> & {
  answer: IAnswer;
};

export interface IQuestionsByCategories {
  [categoryId: string]: TQuestionWithAnswer[];
}

export const useAuditContext = () => {
  const context = useContext(AuditContext);
  if (!context)
    throw new Error('useAuditContext must be used within the AuditProvider');

  return context;
};

const AuditProvider = ({ children }) => {
  const toast = useToast();
  const { id }: { id: string } = useParams();
  const { navigateTo } = useNavigate();

  const [updateAudit] = useMutation(UPDATE_AUDIT);
  const [submitAudit] = useMutation(SUBMIT_AUDIT);

  const [createQuestion] = useMutation(ADD_QUESTION);
  const [saveQuestion] = useMutation(SAVE_QUESTION);
  const [deleteQuestion] = useMutation(DELETE_QUESTION);

  const [createAnswer] = useMutation(ADD_ANSWER);
  const [saveAnswer] = useMutation(SAVE_ANSWER);
  const [deleteAnswer] = useMutation(DELETE_ANSWER);

  const [selectedQuestion, setSelectedQuestion] =
    useState<TDeepPartial<TQuestionWithAnswer>>();

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
  const site = audit?.site;
  const area = audit?.area;
  const auditor = audit?.auditor;
  const participants = audit?.participants;

  const { data: auditData, refetch: refetchAuditData } = useQuery(
    GET_AUDIT_DATA,
    {
      variables: {
        questionsCategoryQuery: {
          _ids: auditType?.sections.map(({ _id }) => _id),
        },
        auditTypeQuestionQuery: {
          scope: { type: 'auditType', _id: audit?.auditType._id },
        },
        auditCustomQuestionQuery: { scope: { type: 'audit', _id: audit?._id } },
      },
      skip: !audit,
    },
  );

  // Save questions categories in the same order as defined in audit type
  const questionsCategories = useMemo(() => {
    if (!auditData || !auditType?.sections) return [];

    return auditType?.sections?.map(({ _id }) =>
      auditData?.questionsCategories?.find(
        ({ _id: categoryId }) => categoryId === _id,
      ),
    );
  }, [JSON.stringify(auditData), JSON.stringify(auditType)]);

  const customQuestionsCategories = useMemo(
    () =>
      questionsCategories.filter((category) => category.allowCustomQuestions),
    [questionsCategories],
  );

  // Group (custom and predefined) questions by category
  const questions: IQuestionsByCategories = useMemo(() => {
    if (!auditData?.auditCustomQuestions) return {};

    const questionsByCategories: IQuestionsByCategories = {};

    auditData.auditTypeQuestionQuery?.forEach((question) => {
      if (!questionsByCategories[question.questionsCategoryId])
        questionsByCategories[question.questionsCategoryId] = [];
      questionsByCategories[question.questionsCategoryId].push(question);
    });

    auditData.auditCustomQuestions?.forEach((question) => {
      if (!questionsByCategories[question.questionsCategoryId])
        questionsByCategories[question.questionsCategoryId] = [];
      questionsByCategories[question.questionsCategoryId].push(question);
    });

    return questionsByCategories;
  }, [JSON.stringify(auditData)]);

  useEffect(() => {
    if (!loading && error) {
      toast({
        title: 'Audit not found',
        description: 'Audit does not exist',
      });
      navigateTo('/');
    }
  }, [error]);

  const refetch = async () => {
    await refetchAudit();
    await refetchAuditData();
  };

  const createCustomQuestionAndAnswer = async (
    questionValues: TDeepPartial<TQuestionWithAnswer>,
  ) => {
    const { _id, answer, ...question } = questionValues;
    const createdQuestionRes = await createQuestion({
      variables: {
        question: {
          ...question,
          scope: {
            type: 'audit',
            _id: audit?._id,
          },
        },
      },
    });
    const createdQuestion = createdQuestionRes.data.createQuestion;
    if (answer) {
      await createAnswer({
        variables: {
          answer: {
            ...answer,
            questionId: createdQuestion._id,
            scope: {
              type: 'audit',
              _id: audit?._id,
            },
          },
        },
      });
    }
    refetch();
  };

  const saveCustomQuestionAndAnswer = async (
    questionValues: TDeepPartial<TQuestionWithAnswer>,
  ) => {
    const { answer, ...question } = questionValues;
    await saveQuestion({
      variables: {
        question,
      },
    });
    if (answer) {
      await saveAnswer({
        variables: {
          answer,
        },
      });
    }
    refetch();
  };

  const deleteCustomQuestionAndAnswer = async (
    question: TDeepPartial<TQuestionWithAnswer>,
  ) => {
    await deleteQuestion({
      variables: {
        _id: question._id,
      },
    });
    if (question.answer) {
      await deleteAnswer({
        variables: {
          _id: question.answer?._id,
        },
      });
    }
    refetch();
  };

  const value = useMemo(
    () => ({
      audit,
      auditType,
      auditor,
      participants,
      site,
      area,
      questionsCategories,
      customQuestionsCategories,
      questions,
      loading,
      selectedQuestion,
      setSelectedQuestion,
      createCustomQuestionAndAnswer,
      saveCustomQuestionAndAnswer,
      deleteCustomQuestionAndAnswer,
      updateAudit,
      submitAudit,
      refetch,
    }),
    [
      audit,
      auditType,
      auditor,
      participants,
      site,
      area,
      questions,
      loading,
      selectedQuestion,
    ],
  );

  return (
    <AuditContext.Provider value={value}>{children}</AuditContext.Provider>
  );
};

export default AuditProvider;
