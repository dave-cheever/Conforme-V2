import responses from './responses.q';

const responsesResolvers = {
  Query: {
    responses
  },
  Mutation: {
  },
};

export const responseTypeDef = `
  type ComplianceItem {
    reference: String!
    name: String!
    description: String!
    categoryId: ID!
    functionalAreaId: String!
    regulatoryBodyId: String!
    frequency: String!
  }

  type Category {
    name: String!
  }

  type FunctionalArea {
    name: String!
  }

  type Response {
    _id: ID!
    businessUnitId: String!
    delegateIds: [String!]
    lastRenewalDate: Date!
    nextRenewalDate: Date!
    status: String!
    published: Boolean!
    complianceItem: ComplianceItem!
    category: Category!
    functionalArea: FunctionalArea!
  }
`;

export const responseQueryDef = `
  responses: [Response!]!
`;

export default responsesResolvers;
