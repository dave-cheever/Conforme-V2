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
  type Question {
    _id: ID!
    type: String!
    question: String
    description: String
    questionsCategoryId: String
    required: Boolean
    notApplicable: Boolean
    positiveValue: Any
    negativeValue: Any
    scope: Scope!
    answer: Answer
    metatags: Metatags
  }

  input QuestionQuery {
    _id: ID
    scope: ScopeInput
  }

  input QuestionCreateInput {
    type: String!
    question: String!
    description: String
    questionsCategoryId: String!
    required: Boolean
    notApplicable: Boolean
    positiveValue: Any
    negativeValue: Any
    scope: ScopeInput!
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
  questions(questionQuery: QuestionQuery): [Question!]!
`;

export const questionsMutationDefs = `
  createQuestion(question: QuestionCreateInput!): Question!
  updateQuestion(questionInput: QuestionModifyInput!): Question!
  deleteQuestion(_id: ID!): Boolean!
`;

export default questionsResolvers;
