import createQuestionsCategory from './createQuestionsCategory.m';
import deleteQuestionsCategory from './deleteQuestionsCategory.m';
import questionsCategories from './questionsCategories.q';
import updateQuestionsCategory from './updateQuestionsCategory.m';

const questionsCategoryResolvers = {
  Query: {
    questionsCategories,
  },
  Mutation: {
    createQuestionsCategory,
    deleteQuestionsCategory,
    updateQuestionsCategory,
  },
};

export const questionsCategoriesTypeDefs = `
  type QuestionsCategoryOption {
    type: String!
    name: String!
    value: String
  }

  type QuestionsCategory {
    _id: ID!
    name: String!
    withAnswers: Boolean!
    allowCustomQuestions: Boolean!
    maxQuestionsNumber: Int!
    icon: String!
    options: [QuestionsCategoryOption!]
    scope: Scope!
    metatags: Metatags
  }

  input QuestionsCategoryQuery {
    _id: ID
    _ids: [ID]
    scope: ScopeInput
  }

  input QuestionsCategoryOptionInput {
    type: String!
    name: String!
    value: String
  }

  input QuestionsCategoryCreateInput {
    name: String!
    withAnswers: Boolean!
    allowCustomQuestions: Boolean!
    maxQuestionsNumber: Int!
    icon: String!
    options: [QuestionsCategoryOptionInput!]
    scope: ScopeInput!
  }
  
  input QuestionsCategoryModifyInput {
    _id: ID!
    name: String!
    withAnswers: Boolean!
    allowCustomQuestions: Boolean!
    maxQuestionsNumber: Int!
    icon: String!
    options: [QuestionsCategoryOptionInput!]
  }
`;

export const questionsCategoriesQueryDefs = `
  questionsCategories(questionsCategoryQuery: QuestionsCategoryQuery): [QuestionsCategory!]!
`;

export const questionsCategoriesMutationDefs = `
  createQuestionsCategory(questionsCategory: QuestionsCategoryCreateInput!): QuestionsCategory!
  updateQuestionsCategory(questionsCategoryInput: QuestionsCategoryModifyInput!): QuestionsCategory!
  deleteQuestionsCategory(_id: String!): Boolean!
`;

export default questionsCategoryResolvers;
