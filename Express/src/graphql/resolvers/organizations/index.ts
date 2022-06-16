import organization from './organization.q';

const organizationsResolvers = {
  Query: {
    organization,
  },
  Mutation: {},
};

export const organizationsTypeDefs = `
  type Module {
    _id: ID!
    type: String!
    name: String!
    path: String!
    showInNavigation: Boolean
    translations: Any
  }

  type Organization {
    _id: ID!
    name: String!
    licenceExpirationDate: Date!
    logoUrl: String
    bgImageUrl: String
    bgImageTabletUrl: String
    theme: Object!
    modules: [Module]
    revokedPermissions: [String]
    clientId: String
    tenantId: String
    secret: String
  }
`;

export const organizationsQueryDefs = `
  organization: Organization!
`;

export default organizationsResolvers;
