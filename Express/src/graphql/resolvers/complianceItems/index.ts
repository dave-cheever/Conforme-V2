import complianceItems from "./complianceItems.q";
import createComplianceItem from "./createComplianceItem.m";
import deleteComplianceItem from "./deleteComplianceItem.m";
import updateComplianceItem from "./updateComplianceItem.m";

const complianceItemsResolvers = {
  Query: {
    complianceItems,
  },
  Mutation: {
    createComplianceItem,
    deleteComplianceItem,
    updateComplianceItem,
  },
};

export const complianceItemsTypeDefs = `
  type Question {
    type: String!
    name: String!
    description: String
    value: Any
    required: Boolean
    outdated: Boolean
  }

  type ComplianceItem {
    _id: ID!
    name: String
    description: String
    categoryId: ID
    category: BaseWithName
    regulatoryBodyId: ID
    regulatoryBody: BaseWithName
    dueDate: Date
    frequency: String
    businessUnitsIds: [ID!]
    evidenceItems: [String!]
    retentionPeriod: Int
    questions: [Question]
    published: Boolean
    reference: String
  }

  input QuestionInput {
    type: String!
    name: String!
    description: String
    value: Any
    required: Boolean
    outdated: Boolean
  }

  input ComplianceItemInput {
    name: String
    description: String
    categoryId: ID
    regulatoryBodyId: ID
    dueDate: Date
    frequency: String
    businessUnitsIds: [ID!]
    evidenceItems: [String!]
    retentionPeriod: Int
    questions: [QuestionInput]
    published: Boolean
  }

  input ComplianceItemsQueryInput {
    published: Boolean
  }

  input ComplianceItemModifyInput {
    _id: ID!
    name: String
    description: String
    categoryId: ID
    regulatoryBodyId: ID
    dueDate: Date
    frequency: String
    businessUnitsIds: [ID!]
    evidenceItems: [String!]
    retentionPeriod: Int
    questions: [QuestionInput]
    published: Boolean
  }
`;

export const complianceItemsQueryDefs = `
  complianceItems(complianceItemsQueryInput: ComplianceItemsQueryInput): [ComplianceItem!]!
`;

export const complianceItemsMutationDefs = `
  createComplianceItem(complianceItemInput: ComplianceItemInput!): ComplianceItem!
  updateComplianceItem(complianceItemModifyInput: ComplianceItemModifyInput!): ComplianceItem!
  deleteComplianceItem(_id: String!): Boolean!
`;

export default complianceItemsResolvers;
