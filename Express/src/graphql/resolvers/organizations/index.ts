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
    logoUrl: String!
    theme: Object!
    addons: Object
  }
`;

export const organizationsQueryDefs = `
  organization: Organization!
`;

export default organizationsResolvers;
