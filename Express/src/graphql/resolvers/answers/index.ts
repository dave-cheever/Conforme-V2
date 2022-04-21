import addAnswerDocuments from './addAnswerDocuments.m';
import answers from './answers.q';
import createAnswer from './createAnswer.m';
import deleteAnswer from './deleteAnswer.m';
import removeAnswerDocument from './removeAnswerDocument.m';
import updateAnswer from './updateAnswer.m';

const answersResolvers = {
  Query: {
    answers,
  },
  Mutation: {
    createAnswer,
    deleteAnswer,
    updateAnswer,
    addAnswerDocuments,
    removeAnswerDocument,
  },
};

export const answersTypeDefs = `
  type Answer {
    _id: ID!
    questionId: ID!
    question: Question
    answer: String
    attachments: [Document]
    status: String
    options: Any
    scope: Scope
    metatags: Metatags
  }

  input AnswerQuery {
    _id: ID
    questionsIds: [ID]
    scope: ScopeInput
  }

  input AnswerCreateInput {
    questionId: ID!
    answer: String
    status: String
    options: Any
    attachments: [DocumentInput]
    scope: ScopeInput!
  }
  
  input AnswerModifyInput {
    _id: ID!
    answer: String
    status: String
    options: Any
    attachments: [DocumentInput]
  }

  input AnswerDocumentsAddInput {
    _id: ID!
    uploaded: [DocumentInput]!
  }

  input AnswerDocumentRemoveInput {
    _id: ID!
    documentId: ID!
    documentType: String
  }
`;

export const answersQueryDefs = `
  answers(answerQuery: AnswerQuery): [Answer!]!
`;

export const answersMutationDefs = `
  createAnswer(answer: AnswerCreateInput!): Answer!
  updateAnswer(answerInput: AnswerModifyInput!): Answer!
  deleteAnswer(_id: ID!): Boolean!
  addAnswerDocuments(answerDocumentsAddInput: AnswerDocumentsAddInput!): Boolean!
  removeAnswerDocument(answerDocumentRemoveInput: AnswerDocumentRemoveInput!): Boolean!
`;

export default answersResolvers;
