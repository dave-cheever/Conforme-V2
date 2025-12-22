import actionCategories from './actionCategories.q';
import createActionCategory from './createActionCategory.m';
import deleteActionCategory from './deleteActionCategory.m';
import updateActionCategory from './updateActionCategory.m';

const actionCategoriesResolvers = {
  Query: {
    actionCategories,
  },
  Mutation: {
    createActionCategory,
    deleteActionCategory,
    updateActionCategory,
  },
};

export const actionCategoriesTypeDefs = `
  type ActionCategory {
    _id: ID!
    name: String!
    metatags: Metatags
  }

  type ActionCategoriesResponse {
    actionCategories: [ActionCategory!]!
    total: Int!
  }

  input ActionCategoryCreateInput {
    name: String!
  }
  
  input ActionCategoryModifyInput {
    _id: ID!
    name: String!
  }
`;

export const actionCategoriesQueryDefs = `
  actionCategories(pagination: PaginationInput): ActionCategoriesResponse!
`;

export const actionCategoriesMutationDefs = `
  createActionCategory(actionCategory: ActionCategoryCreateInput!): ActionCategory!
  updateActionCategory(actionCategoryInput: ActionCategoryModifyInput!): ActionCategory!
  deleteActionCategory(_id: String!): Boolean!
`;

export default actionCategoriesResolvers;

