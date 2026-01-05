import actionTemplates from './actionTemplates.q';
import createActionTemplate from './createActionTemplate.m';
import deleteActionTemplate from './deleteActionTemplate.m';
import updateActionTemplate from './updateActionTemplate.m';

const actionTemplatesResolvers = {
  Query: {
    actionTemplates,
  },
  Mutation: {
    createActionTemplate,
    deleteActionTemplate,
    updateActionTemplate,
  },
};

export const actionTemplatesTypeDefs = `
  type ActionTemplate {
    _id: ID!
    title: String!
    description: String
    actionCategoryId: ID!
    metatags: Metatags
  }

  type ActionTemplatesResponse {
    actionTemplates: [ActionTemplate!]!
    total: Int!
  }

  input ActionTemplateCreateInput {
    title: String!
    description: String
    actionCategoryId: ID!
  }
  
  input ActionTemplateModifyInput {
    _id: ID!
    title: String!
    description: String
    actionCategoryId: ID!
  }
`;

export const actionTemplatesQueryDefs = `
  actionTemplates(pagination: PaginationInput): ActionTemplatesResponse!
`;

export const actionTemplatesMutationDefs = `
  createActionTemplate(actionTemplate: ActionTemplateCreateInput!): ActionTemplate!
  updateActionTemplate(actionTemplateInput: ActionTemplateModifyInput!): ActionTemplate!
  deleteActionTemplate(_id: String!): Boolean!
`;

export default actionTemplatesResolvers;

