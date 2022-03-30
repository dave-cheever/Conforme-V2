import createQuestion from './createQuestion.m';
import deleteQuestion from './deleteQuestion.m';
import questions from './questions.q';
import updateQuestion from './updateQuestion.m';

const questionsResolvers = {
  Query: {
    questions,
  },
  Mutation: {
    createQuestion,
    deleteQuestion,
    updateQuestion,
  },
};

export const questionsTypeDefs = `
  type QuestionScope {
    component: String!
    type: String
    _id: String
  }

  type Question {
    _id: ID!
    type: String!
    question: String!
    description: String
    questionsCategoryId: String
    required: Boolean
    notApplicable: Boolean
    positiveValue: Any
    negativeValue: Any
    scope: QuestionScope!
    metatags: Metatags
  }

  input QuestionScopeInput {
    component: String!
    type: String
    _id: String
  }

  input QuestionQueryInput {
    _id: ID
    scope: QuestionScopeInput
  }

  input QuestionCreateInput {
    type: String!
    question: String!
    description: String
    questionsCategoryId: String
    required: Boolean
    notApplicable: Boolean
    positiveValue: Any
    negativeValue: Any
    scope: QuestionScopeInput!
  }
  
  input QuestionModifyInput {
    _id: ID!
    question: String
    description: String
    questionsCategoryId: String
    required: Boolean
    notApplicable: Boolean
    positiveValue: Any
    negativeValue: Any
  }
`;

export const questionsQueryDefs = `
  questions: [Question!]!
`;

export const questionsMutationDefs = `
  createQuestion(question: QuestionCreateInput!): Question!
  updateQuestion(questionInput: QuestionModifyInput!): Question!
  deleteQuestion(_id: String!): Boolean!
`;

export default questionsResolvers;
