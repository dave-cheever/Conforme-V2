import responses from './responses.q';
import addParticipant from './addParticipant.m';
import removeDocument from './removeDocument.m';
import removeParticipant from './removeParticipant.m';
import renewResponse from './renewResponse.m';
import updateResponseQuestions from './updateResponseQuestions.m';

const responsesResolvers = {
  Query: {
    responses
  },
  Mutation: {
    addParticipant,
    removeParticipant,
    removeDocument,
    renewResponse,
    updateResponseQuestions,
  },
};

export const responsesTypeDefs = `

  type ResponseDocument {
    id: String!
    name: String!
    addedAt: Date!
    thumbnail: String
    path: String
  }

  type ResponseEvidence {
    name: String!
    uploaded: ResponseDocument
    outdated: Boolean
  }

  type ResponseQuestion {
    type: String!
    name: String!
    description: String
    value: Any
    required: Boolean
    outdated: Boolean
  }

  type Response {
    _id: ID!
    businessUnitId: ID!
    accountableId: ID!
    responsibleId: ID
    contributorsIds: [ID]
    followersIds: [ID]
    lastRenewalDate: Date
    nextRenewalDate: Date
    status: String!
    published: Boolean!
    complianceItemId: ID!
    complianceItem: ComplianceItem
    businessUnit: BusinessUnit
    evidence: [ResponseEvidence]
    attachments: [ResponseDocument]
    questions: [ResponseQuestion]
    daysToDueDate: Int
    metatags: Metatags
  }

  input ResponsesQuery {
    _id: ID
    complianceItemsIds: [ID]
    regulatoryBodiesIds: [ID]
    categoriesIds: [ID]
    businessUnitsIds: [ID]
    usersIds: [ID]
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

  input ResponseDocumentRemoveInput {
    _id: ID!
    documentId: ID!
    documentType: String
  }

  input UpdateResponseQuestionsModify {
    _id: ID!
    answers: Any
  }
`;

export const responsesQueryDefs = `
  responses(responsesQuery: ResponsesQuery): [Response!]!
`;

export const responsesMutationDefs = `
  addParticipant(responseParticipantModify: ResponseParticipantModify!): Response!
  removeParticipant(responseParticipantRemove: ResponseParticipantRemove!): Boolean!
  removeDocument(responseDocumentRemoveInput: ResponseDocumentRemoveInput!): Boolean!
  renewResponse(_id: ID!): Response!
  updateResponseQuestions(updateResponseQuestionsModify: UpdateResponseQuestionsModify!): Boolean!
`;

export default responsesResolvers;
