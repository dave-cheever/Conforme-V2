import cloneTrackerItem from './cloneTrackerItem.m';
import createTrackerItem from './createTrackerItem.m';
import deleteTrackerItem from './deleteTrackerItem.m';
import trackerItems from './trackerItems.q';
import updateTrackerItem from './updateTrackerItem.m';

const trackerItemsResolvers = {
  Query: {
    trackerItems,
  },
  Mutation: {
    createTrackerItem,
    deleteTrackerItem,
    updateTrackerItem,
    cloneTrackerItem,
  },
};

export const trackerItemsTypeDefs = `
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
  
  type TrackerItem {
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

  input TrackerItemInput {
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
  
  input TrackerItemsQueryInput {
    published: Boolean
    trackerItemsIds: [ID]
    regulatoryBodiesIds: [ID]
    categoriesIds: [ID]
    businessUnitsIds: [ID]
    locationsIds: [ID]
  }
  
  input TrackerItemModifyInput {
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

  type TrackerItemsResult {
    trackerItems: [TrackerItem!]!
    total: Int!
  }
`;

export const trackerItemsQueryDefs = `
  trackerItems(trackerItemsQueryInput: TrackerItemsQueryInput, pagination: PaginationInput): TrackerItemsResult!
`;

export const trackerItemsMutationDefs = `
  createTrackerItem(trackerItemInput: TrackerItemInput!): TrackerItem!
  updateTrackerItem(trackerItemModifyInput: TrackerItemModifyInput!): TrackerItem!
  deleteTrackerItem(_id: ID!): Boolean!
  cloneTrackerItem(_id: ID!): TrackerItem!
`;

export default trackerItemsResolvers;
