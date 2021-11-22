import responses from './responses.q';
import updateResponse from './updateResponse.m';
import addDelegate from './addDelegate.m';
import removeDelegate from './removeDelegate.m';

const responsesResolvers = {
  Query: {
    responses
  },
  Mutation: {
    updateResponse,
    addDelegate,
    removeDelegate
  },
};

export const responsesTypeDefs = `
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
  }

  input ResponsesQueryInput {
    _id: String
    complianceItemsIds: [String]
    regulatoryBodiesIds: [String]
    categoriesIds: [String]
    functionalAreasIds: [String]
    businessUnitsIds: [String]
    usersIds: [String]
    dueDate: [String]
  }

  input ResponseModifyInput {
    _id: String!
  }

  input ResponseDelegateModifyInput {
    _id: String!
    delegateId: ID!
  }
`;

export const responsesQueryDefs = `
  responses(responsesQueryInput: ResponsesQueryInput): [Response!]!
`;

export const responsesMutationDefs = `
  updateResponse(responseModifyInput: ResponseModifyInput!): Response!
  addDelegate(responseDelegateModifyInput: ResponseDelegateModifyInput!): Response!
  removeDelegate(responseDelegateModifyInput: ResponseDelegateModifyInput!): Boolean!
`;

export default responsesResolvers;
