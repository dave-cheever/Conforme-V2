import responses from './responses.q';
import addParticipant from './addParticipant.m';
import removeDocument from './removeDocument.m';
import updateQuestions from './updateQuestions.m';
import removeParticipant from './removeParticipant.m';

const responsesResolvers = {
  Query: {
    responses
  },
  Mutation: {
    addParticipant,
    removeParticipant,
    removeDocument,
    updateQuestions,
  },
};

export const responsesTypeDefs = `

  type Choices {
    label: String
    isCorrect: Boolean
  }


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
    choices: Choices
  }

  type Response {
    _id: ID!
    businessUnitId: ID!
    accountableId: ID!
    responsibleId: ID!
    contributorsIds: [ID]
    followersIds: [ID]
    lastRenewalDate: Date
    nextRenewalDate: Date
    status: String!
    complianceItemId: ID!
    complianceItem: ComplianceItem
    businessUnit: BusinessUnit
    evidence: [ResponseEvidence]
    attachments: [ResponseDocument]
    questions: [ResponseQuestion]
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
  updateQuestions(updateResponseQuestionsModify: UpdateResponseQuestionsModify!): Boolean!
`;

export default responsesResolvers;
