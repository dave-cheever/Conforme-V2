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

export default settingsResolvers;
