import addDocuments from './addDocuments.m';
import addParticipant from './addParticipant.m';
import removeDocument from './removeDocument.m';
import removeParticipant from './removeParticipant.m';
import renewResponse from './renewResponse.m';
import responses from './responses.q';
import submitResponse from './submitResponse.m';
import updateResponse from './updateResponse.m';
import updateResponseQuestions from './updateResponseQuestions.m';

const responsesResolvers = {
  Query: {
    responses,
  },
  Mutation: {
    addParticipant,
    removeParticipant,
    addDocuments,
    removeDocument,
    renewResponse,
    updateResponseQuestions,
    updateResponse,
    submitResponse,
  },
};

export const responsesTypeDefs = `

  type Options {
    label: String!
    value: String!
  }
  
  type ResponseEvidence {
    name: String!
    uploaded: Document
  }

  type ResponseQuestion {
    type: String!
    name: String!
    description: String
    value: Any
    required: Boolean
    requiredAnswer: Any
    notApplicable: Boolean
    options: [Options]
  }

  type Response {
    _id: ID!
    businessUnitId: ID!
    accountableId: ID!
    responsibleId: ID
    contributorsIds: [ID]
    followersIds: [ID]
    lastCompletionDate: Date
    dueDate: Date
    status: String!
    calculatedStatus: String!
    published: Boolean!
    trackerItemId: ID!
    trackerItem: TrackerItem
    businessUnit: BusinessUnit
    evidence: [ResponseEvidence]
    attachments: [Document]
    questions: [ResponseQuestion]
    responsible: User
    daysToDueDate: Int
    metatags: Metatags
  }

  input UserRoleIds {
    responsibleIds: [String]
    accountableIds: [String]
    contributorIds: [String]
    followerIds: [String]
  }

  input ResponsesQuery {
    _id: ID
    trackerItemsIds: [ID]
    regulatoryBodiesIds: [ID]
    categoriesIds: [ID]
    businessUnitsIds: [ID]
    locationsIds: [ID]
    usersIds: UserRoleIds
    dueDate: [String]
    includeNotPublished: Boolean
  }

  input ResponseParticipantModify {
    _id: ID!
    participantIds: [ID]
    permission: String!
  }

  input ResponseParticipantRemove {
    _id: ID!
    participantId: ID
    permission: String!
  }

  input ResponseDocumentsAddInput {
    _id: ID!
    documentType: String!
    documentName: String
    uploaded: [DocumentInput]!
  }

  input ResponseDocumentRemoveInput {
    _id: ID!
    documentId: ID!
    documentType: String
  }

  input UpdateResponseQuestionsModify {
    _id: ID!
    answers: Any
  }

  input UpdateResponseModify {
    _id: ID!
    dueDate: Date
  }
`;

export const responsesQueryDefs = `
  responses(responsesQuery: ResponsesQuery): [Response!]!
`;

export const responsesMutationDefs = `
  addParticipant(responseParticipantModify: ResponseParticipantModify!): Response!
  removeParticipant(responseParticipantRemove: ResponseParticipantRemove!): Boolean!
  addDocuments(responseDocumentsAddInput: ResponseDocumentsAddInput!): Boolean!
  removeDocument(responseDocumentRemoveInput: ResponseDocumentRemoveInput!): Boolean!
  renewResponse(_id: ID!): Response!
  submitResponse(_id: ID!): Date!
  updateResponseQuestions(updateResponseQuestionsModify: UpdateResponseQuestionsModify!): Boolean!
  updateResponse(updateResponseModify: UpdateResponseModify!): Response!
`;

export default responsesResolvers;
