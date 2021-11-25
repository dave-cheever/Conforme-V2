import responses from './responses.q';
import addDelegate from './addDelegate.m';
import removeDelegate from './removeDelegate.m';
import removeDocument from './removeDocument.m';
import updateQuestions from './updateQuestions.m';

const responsesResolvers = {
  Query: {
    responses
  },
  Mutation: {
    addDelegate,
    removeDelegate,
    removeDocument,
    updateQuestions,
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
    delegateIds: [ID!]!
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
    functionalAreasIds: [ID]
    businessUnitsIds: [ID]
    usersIds: [ID]
    dueDate: [String]
    includeNotPublished: Boolean
  }

  input ResponseDelegateModifyInput {
    _id: ID!
    delegateId: ID!
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
  addDelegate(responseDelegateModifyInput: ResponseDelegateModifyInput!): Response!
  removeDelegate(responseDelegateModifyInput: ResponseDelegateModifyInput!): Boolean!
  removeDocument(responseDocumentRemoveInput: ResponseDocumentRemoveInput!): Boolean!
  updateQuestions(updateResponseQuestionsModify: UpdateResponseQuestionsModify!): Boolean!
`;

export default responsesResolvers;
