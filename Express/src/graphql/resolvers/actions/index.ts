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
    dueDate: Date
    completedDate: Date
    status: String!
    priority: String!
    description: String
    assigneeId: ID
    attachments: [Document]
    scope: Scope!
    answer: Answer
    metatags: Metatags
    assignee: User
    assignor: User
  }

  input ActionUsersInput {
    assigneesIds: [ID]
  }

  input ActionQueryInput {
    _id: ID
    scope: ScopeInput
    status: [String]
    areasIds: [ID]
    sitesIds: [ID]
    usersIds: ActionUsersInput
    dueDate: [String]
  }

  input ActionCreateInput {
    title: ID!
    dueDate: Date
    status: String
    priority: String!
    description: String
    assigneeId: ID
    attachments: [DocumentInput]
    scope: ScopeInput!
  }
  
  input ActionModifyInput {
    _id: ID!
    title: ID
    dueDate: Date
    status: String
    priority: String
    description: String
    assigneeId: ID
    attachments: [DocumentInput]
  }
`;

export const actionsQueryDefs = `
  actions(actionQueryInput: ActionQueryInput): [Action!]!
`;

export const actionsMutationDefs = `
  createAction(action: ActionCreateInput!): Action!
  updateAction(actionInput: ActionModifyInput!): Action!
  deleteAction(_id: ID!): Boolean!
`;

export default actionsResolvers;
