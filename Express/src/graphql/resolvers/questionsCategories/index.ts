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
  type QuestionsCategoryScope {
    component: String!
    type: String
    _id: String
  }

  type QuestionsCategory {
    _id: ID!
    name: String!
    auditType: String
    navigationDisplay: Boolean!
    withAnswers: Boolean!
    allowCustomQuestions: Boolean!
    maxQuestionsNumber: Int!
    icon: String!
    scope: QuestionsCategoryScope!
    metatags: Metatags
  }

  input QuestionsCategoryScopeInput {
    component: String!
    type: String
    _id: String
  }

  input QuestionsCategoryQueryInput {
    _id: ID
    scope: QuestionsCategoryScopeInput
  }

  input QuestionsCategoryCreateInput {
    name: String!
    auditType: String
    navigationDisplay: Boolean!
    withAnswers: Boolean!
    allowCustomQuestions: Boolean!
    maxQuestionsNumber: Int!
    icon: String!
    scope: QuestionsCategoryScopeInput!
  }
  
  input QuestionsCategoryModifyInput {
    _id: ID!
    name: String!
    auditType: String
    navigationDisplay: Boolean!
    withAnswers: Boolean!
    allowCustomQuestions: Boolean!
    maxQuestionsNumber: Int!
    icon: String!
  }
`;

export const questionsCategoriesQueryDefs = `
  questionsCategories: [QuestionsCategory!]!
`;

export const questionsCategoriesMutationDefs = `
  createQuestionsCategory(questionsCategory: QuestionsCategoryCreateInput!): QuestionsCategory!
  updateQuestionsCategory(questionsCategoryInput: QuestionsCategoryModifyInput!): QuestionsCategory!
  deleteQuestionsCategory(_id: String!): Boolean!
`;

export default questionsCategoryResolvers;
