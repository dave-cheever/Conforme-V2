import actions from './actions.q';
import createAction from './createAction.m';
import deleteAction from './deleteAction.m';
import updateAction from './updateAction.m';

const actionsResolvers = {
  Query: {
    actions,
  },
  Mutation: {
    createAction,
    deleteAction,
    updateAction,
  },
};

export const actionsTypeDefs = `
  type Action {
    _id: ID!
    title: ID!
    auditId: String!
    dueDate: Date!
    done: Boolean!
    priority: String!,
    description: String!,
    assignedId: ID!
    metatags: Metatags
  }

  input ActionQueryInput {
    _id: ID
    scope: ScopeInput
  }

  input ActionCreateInput {
    title: ID!
    auditId: String!
    dueDate: Date!
    done: Boolean!
    priority: String!,
    description: String!,
    assignedId: ID!
  }
  
  input ActionModifyInput {
    _id: ID!
    title: ID!
    auditId: String!
    dueDate: Date!
    done: Boolean!
    priority: String!,
    description: String!,
    assignedId: ID!
  }
`;

export const actionsQueryDefs = `
  actions: [Action!]!
`;

export const actionsMutationDefs = `
  createAction(action: ActionCreateInput!): Action!
  updateAction(actionInput: ActionModifyInput!): Action!
  deleteAction(_id: String!): Boolean!
`;

export default actionsResolvers;
