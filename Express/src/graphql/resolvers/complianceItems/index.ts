import createComplianceItem from "./createComplianceItem.m";
// import deleteComplianceItem from "./deleteComplianceItem.m";
// import updateComplianceItem from "./updateComplianceItem.m";
// import complianceItems from "./complianceItems.q";

const complianceItemsResolvers = {
  Query: {
    // complianceItems,
  },
  Mutation: {
    createComplianceItem,
    // deleteComplianceItem,
    // updateComplianceItem,
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
    name: String!
    description: String!
    categoryId: ID!
    category: BaseWithName
    regulatoryBodyId: ID!
    regulatoryBody: BaseWithName
    functionalAreaId: ID!
    functionalArea: BaseWithName
    dueDate: Date!
    frequency: String!
    businessUnitsIds: [ID!]!
    evidenceItems: [String!]!
    retentionPeriod: Int!
    questions: [Question]
    published: Boolean!
    ref: String
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
    ref: String
  }
`;

export const complianceItemsQueryDefs = `
`;

export const complianceItemsMutationDefs = `
  createComplianceItem(complianceItemInput: ComplianceItemInput!): ComplianceItem!
`;

export default complianceItemsResolvers;
