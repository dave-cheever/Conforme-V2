import questionCategories from "./questionCategories.q";
import createQuestionCategory from "./createQuestionCategory.m";
import deleteQuestionCategory from "./deleteQuestionCategory.m";
import updateQuestionCategory from "./updateQuestionCategory.m";

const questionCategoryResolvers = {
    Query: {
        questionCategories,
    },
    Mutation: {
        createQuestionCategory,
        deleteQuestionCategory,
        updateQuestionCategory,
    },
};

export const questionCategoriesTypeDefs = `
  type QuestionCategoryScope {
    component: String!
    type: String
    _id: String
  }

  type QuestionCategory {
    _id: ID!
    auditType: String
    name: String!
    withAnswers: Boolean!
    allowCustomQuestions: Boolean!
    maxQuestionsNumber: Int!
    scope: QuestionCategoryScope!
    metatags: Metatags
  }

  input QuestionCategoryScopeInput {
    component: String!
    type: String
    _id: String
  }

  input QuestionCategoryQueryInput {
    _id: ID
    scope: QuestionCategoryScopeInput
  }

  input QuestionCategoryCreateInput {
    auditType: String
    name: String!
    withAnswers: Boolean!
    allowCustomQuestions: Boolean!
    maxQuestionsNumber: Int!
    scope: QuestionCategoryScopeInput!
  }
  
  input QuestionCategoryModifyInput {
    _id: ID!
    auditType: String
    name: String!
    withAnswers: Boolean!
    allowCustomQuestions: Boolean!
    maxQuestionsNumber: Int!
  }
`;

export const questionCategoriesQueryDefs = `
  questionCategories: [QuestionCategory!]!
`;

export const questionCategoriesMutationDefs = `
  createQuestionCategory(questionCategory: QuestionCategoryCreateInput!): QuestionCategory!
  updateQuestionCategory(questionCategoryInput: QuestionCategoryModifyInput!): QuestionCategory!
  deleteQuestionCategory(_id: String!): Boolean!
`;

export default questionCategoryResolvers;
