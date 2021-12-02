import organization from './organization.q';

const organizationsResolvers = {
  Query: {
    organization,
  },
  Mutation: {
  },
};

export const organizationsTypeDefs = `
  type Organization {
    _id: ID!
    name: String!
    licenceExpirationDate: Date!
    logoUrl: String
    bgImageUrl: String
    theme: Object!
    addons: Object
    clientId: String
    tenantId: String
    secret: String
  }
`;

export const organizationsQueryDefs = `
  organization: Organization!
`;

export default organizationsResolvers;
