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
    removeAnswerDocument,
    updateAnswer,
  },
};

export const answersTypeDefs = `
  type AnswersScope {
    component: String!
    type: String
    _id: String
  }

  type AnswerDocument {
    id: String!
    name: String!
    addedAt: Date!
    thumbnail: String
    path: String
  }

  type Answer {
    _id: ID!
    auditId: String!
    questionId: ID!
    answer: String!
    attachements: [AnswerDocument]
    status: String!
    options: Any!
    scope: AnswersScope!
    metatags: Metatags
  }

  input AnswerQueryInput {
    _id: ID
  }

  input AnswerScopeInput {
    component: String!
    type: String
    _id: String
  }

  input AnswerCreateInput {
    auditId: String!
    questionId: ID!
    answer: String!
    status: String!
    options: Any!
    scope: AnswerScopeInput!
  }
  
  input AnswerModifyInput {
    _id: ID!
    auditId: String!
    questionId: ID!
    answer: String!
    status: String!
    options: Any!
  }

  input AnswerDocumentRemoveInput {
    _id: ID!
    documentId: ID!
    documentType: String
  }
`;

export const answersQueryDefs = `
  answers: [Answer!]!
`;

export const answersMutationDefs = `
  createAnswer(answer: AnswerCreateInput!, auditId: ID!): Answer!
  updateAnswer(answerInput: AnswerModifyInput!, auditId: ID!): Answer!
  deleteAnswer(_id: String!, auditId: ID!): Boolean!
  removeAnswerDocument(answerDocumentRemoveInput: AnswerDocumentRemoveInput!): Boolean!
`;

export default answersResolvers;
