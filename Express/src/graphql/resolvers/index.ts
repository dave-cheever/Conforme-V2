import organizationsResolvers from "./ogranizations";
import settingsResolvers from "./settings";
import regulatoryBodiesResolvers from "./regulatoryBodies";
import functionalAreasResolvers from "./functionalAreas";
import categoriesResolvers from "./categories";
import usersResolvers from "./users";
import responsesResolvers from "./responses";

import scalars from "../scalars";

export default {
  Any: scalars.anyScalar,
  Date: scalars.dateScalar,
  Query: {
    ...organizationsResolvers.Query,
    ...settingsResolvers.Query,
    ...regulatoryBodiesResolvers.Query,
    ...usersResolvers.Query,
    ...functionalAreasResolvers.Query,
    ...categoriesResolvers.Query,
    ...responsesResolvers.Query,
  },
  Mutation: {
    ...regulatoryBodiesResolvers.Mutation,
    ...functionalAreasResolvers.Mutation,
    ...categoriesResolvers.Mutation,
  },
};
