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

export const settingsQueryDef = `
  settings(type: String): [Setting!]!
  roles: String!
`;

export default settingsResolvers;
