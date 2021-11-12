import responses from './responses.q';

const responsesResolvers = {
  Query: {
    responses
  },
  Mutation: {
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
    published: Boolean!
    complianceItemId: ID!
    complianceItem: ComplianceItem
    businessUnit: BusinessUnits
    functionalArea: BaseWithName
    category: BaseWithName
    regulatoryBody: BaseWithName
  }
`;

export const responsesQueryDefs = `
  responses: [Response!]!
`;

export default responsesResolvers;
