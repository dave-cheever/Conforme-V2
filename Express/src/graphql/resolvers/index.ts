import organizationsResolvers from './ogranizations';
import settingsResolvers from './settings';
import usersResolvers from './users';

import scalars from '../scalars';

export default {
  Any: scalars.anyScalar,
  Date: scalars.dateScalar,
  Query: {
    ...organizationsResolvers.Query,
    ...settingsResolvers.Query,
    ...usersResolvers.Query,
  },
  // Mutation: {
  //   ...usersResolvers.Mutation,
  // }
};
