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
    functionalAreaId: ID
    functionalArea: BaseWithName
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
    functionalAreaId: ID
    dueDate: Date
    frequency: String
    businessUnitsIds: [ID!]
    evidenceItems: [String!]
    retentionPeriod: Int
    questions: [QuestionInput]
    published: Boolean
  }

  input ComplianceItemModifyInput {
    _id: ID!
    name: String
    description: String
    categoryId: ID
    regulatoryBodyId: ID
    functionalAreaId: ID
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
  complianceItems: [ComplianceItem!]!
`;

export const complianceItemsMutationDefs = `
  createComplianceItem(complianceItemInput: ComplianceItemInput!): ComplianceItem!
  updateComplianceItem(complianceItemModifyInput: ComplianceItemModifyInput!): ComplianceItem!
  deleteComplianceItem(_id: String!): Boolean!
`;

export default complianceItemsResolvers;
