import roles from './roles.q';
import settings from './settings.q';

const settingsResolvers = {
  Query: {
    roles,
    settings,
  },
  Mutation: {
  },
};

export const settingsTypeDefs = `
  type Setting {
    _id: ID!
    name: String!
    value: Any!
    label: String!
    type: String!
    description: String!
    options: [String]
    organizationId: String!
  }
`;

export const settingsQueryDefs = `
  settings(type: String): [Setting!]!
  roles: String!
`;

export default settingsResolvers;
