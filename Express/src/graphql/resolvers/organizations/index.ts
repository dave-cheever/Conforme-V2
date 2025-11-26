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
    defaultFilters: Any
    path: String!
    icon: String!
    showInNavigation: Boolean
    translations: Any
    customQuestionsInDashboard: [String]
    featureFlags: Any
    settings: Any
  }

  type Organization {
    _id: ID!
    name: String!
    licenceExpirationDate: Date!
    logoUrl: String
    logoUrlMobile: String
    bgImageUrl: String
    bgImageTabletUrl: String
    theme: Object!
    modules: [Module]
    revokedPermissions: [String]
    clientId: String
    tenantId: String
    secret: String
    loginText: String
    logoutText: String
  }
`;

export const organizationsQueryDefs = `
  organization: Organization!
`;

export default organizationsResolvers;
