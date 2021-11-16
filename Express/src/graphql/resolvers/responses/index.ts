import responses from './responses.q';
import updateResponse from './updateResponse.m';

const responsesResolvers = {
  Query: {
    responses
  },
  Mutation: {
    updateResponse
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
  }

  input ResponseModifyInput {
    delegateIds: [ID!]
  }
`;

export const responsesQueryDefs = `
  responses(responsesQueryInput: ResponsesQueryInput): [Response!]!
`;

export const responsesMutationDefs = `
  updateResponse(responseModifyInput: ResponseModifyInput!): Response!
`;

export default responsesResolvers;
