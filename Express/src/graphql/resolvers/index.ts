import businessUnitsResolvers from "./businessUnits"
import categoriesResolvers from "./categories";
import commentsResolvers from "./comments";
import complianceItemsResolvers from "./complianceItems";
import functionalAreasResolvers from "./functionalAreas";
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
    ...functionalAreasResolvers.Query,
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
    ...functionalAreasResolvers.Mutation,
    ...complianceItemsResolvers.Mutation,
    ...regulatoryBodiesResolvers.Mutation,
    ...responsesResolvers.Mutation
  },
};
