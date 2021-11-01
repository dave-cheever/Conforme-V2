import organizationsResolvers from './ogranizations';
import settingsResolvers from './settings';
import regulatoryBodiesResolvers from './regulatoryBodies';
import usersResolvers from './users';

import scalars from '../scalars';

export default {
  Any: scalars.anyScalar,
  Date: scalars.dateScalar,
  Query: {
    ...organizationsResolvers.Query,
    ...settingsResolvers.Query,
    ...regulatoryBodiesResolvers.Query,
    ...usersResolvers.Query,
  },
  Mutation: {
    ...regulatoryBodiesResolvers.Mutation,
  }
};
