import responses from './responses.q';
import addDelegate from './addDelegate.m';
import removeDelegate from './removeDelegate.m';
import removeDocument from './removeDocument.m';

const responsesResolvers = {
  Query: {
    responses
  },
  Mutation: {
    addDelegate,
    removeDelegate,
    removeDocument,
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
  }

  input ResponsesQueryInput {
    _id: ID
    complianceItemsIds: [ID]
    regulatoryBodiesIds: [ID]
    categoriesIds: [ID]
    functionalAreasIds: [ID]
    businessUnitsIds: [ID]
    usersIds: [ID]
    dueDate: [String]
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
`;

export const responsesQueryDefs = `
  responses(responsesQueryInput: ResponsesQueryInput): [Response!]!
`;

export const responsesMutationDefs = `
  addDelegate(responseDelegateModifyInput: ResponseDelegateModifyInput!): Response!
  removeDelegate(responseDelegateModifyInput: ResponseDelegateModifyInput!): Boolean!
  removeDocument(responseDocumentRemoveInput: ResponseDocumentRemoveInput!): Boolean!
`;

export default responsesResolvers;
