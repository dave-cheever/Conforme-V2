import businessUnitsResolvers from "./businessUnits"
import categoriesResolvers from "./categories";
import commentsResolvers from "./comments";
import complianceItemsResolvers from "./complianceItems";
import graphResolvers from "./graph";
import organizationsResolvers from "./organizations";
import regulatoryBodiesResolvers from "./regulatoryBodies";
import responsesResolvers from "./responses";
import settingsResolvers from "./settings";
import usersResolvers from "./users";

import scalars from "../scalars";

export default {
  Any: scalars.anyScalar,
  Date: scalars.dateScalar,
  Query: {
    ...businessUnitsResolvers.Query,
    ...categoriesResolvers.Query,
    ...commentsResolvers.Query,
    ...complianceItemsResolvers.Query,
    ...graphResolvers.Query,
    ...organizationsResolvers.Query,
    ...regulatoryBodiesResolvers.Query,
    ...responsesResolvers.Query,
    ...settingsResolvers.Query,
    ...usersResolvers.Query,
  },
  Mutation: {
    ...businessUnitsResolvers.Mutation,
    ...categoriesResolvers.Mutation,
    ...commentsResolvers.Mutation,
    ...complianceItemsResolvers.Mutation,
    ...regulatoryBodiesResolvers.Mutation,
    ...responsesResolvers.Mutation,
    ...settingsResolvers.Mutation,
    ...usersResolvers.Mutation
  },
};
