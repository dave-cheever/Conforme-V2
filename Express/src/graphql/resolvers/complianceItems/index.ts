import cloneComplianceItem from './cloneComplianceItem.m';
import complianceItems from './complianceItems.q';
import createComplianceItem from './createComplianceItem.m';
import deleteComplianceItem from './deleteComplianceItem.m';
import updateComplianceItem from './updateComplianceItem.m';

const complianceItemsResolvers = {
  Query: {
    complianceItems,
  },
  Mutation: {
    createComplianceItem,
    deleteComplianceItem,
    updateComplianceItem,
    cloneComplianceItem,
  },
};

export const complianceItemsTypeDefs = `

  type Options {
    label: String!
    value: String!
  }

  type Question {
    type: String!
    name: String!
    description: String
    value: Any
    required: Boolean
    outdated: Boolean
    requiredAnswer: Any
    notApplicable: Boolean
    options: [Options]
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
    dueDateCalculation: String
    dueDateEditable: Boolean
    frequency: String
    businessUnitsIds: [ID!]
    locations: [Location]
    locationsIds: [ID]
    evidenceItems: [String!]
    allowAttachments: Boolean
    questions: [Question]
    published: Boolean
    reference: String
  }

  input OptionsInput {
    label: String!
    value: String!
  }

  input QuestionInput {
    type: String!
    name: String!
    description: String
    value: Any
    required: Boolean
    outdated: Boolean
    requiredAnswer : Any
    notApplicable: Boolean
    options: [OptionsInput]
  }

  input ComplianceItemInput {
    name: String
    description: String
    categoryId: ID
    regulatoryBodyId: ID
    dueDate: Date
    dueDateCalculation: String
    dueDateEditable: Boolean
    frequency: String
    businessUnitsIds: [ID!]
    locationsIds: [ID!]
    evidenceItems: [String!]
    allowAttachments: Boolean
    questions: [QuestionInput]
    published: Boolean
  }
  
  input ComplianceItemsQueryInput {
    published: Boolean
    complianceItemsIds: [ID]
    regulatoryBodiesIds: [ID]
    categoriesIds: [ID]
    businessUnitsIds: [ID]
    locationsIds: [ID]
  }
  
  input ComplianceItemModifyInput {
    _id: ID!
    name: String
    description: String
    categoryId: ID
    regulatoryBodyId: ID
    dueDate: Date
    dueDateCalculation: String
    dueDateEditable: Boolean
    frequency: String
    businessUnitsIds: [ID!]
    locationsIds: [ID!]
    evidenceItems: [String!]
    allowAttachments: Boolean
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
  deleteComplianceItem(_id: ID!): Boolean!
  cloneComplianceItem(_id: ID!): ComplianceItem!
`;

export default complianceItemsResolvers;
