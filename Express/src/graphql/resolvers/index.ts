import categoriesResolvers from "./categories";
import complianceItemsResolvers from "./complianceItems";
import functionalAreasResolvers from "./functionalAreas";
import organizationsResolvers from "./ogranizations";
import regulatoryBodiesResolvers from "./regulatoryBodies";
import settingsResolvers from "./settings";
import usersResolvers from "./users";
import businessUnitsResolvers from "./businessUnits"
import responsesResolvers from "./responses";

import scalars from "../scalars";

export default {
  Any: scalars.anyScalar,
  Date: scalars.dateScalar,
  Query: {
    ...categoriesResolvers.Query,
    ...complianceItemsResolvers.Query,
    ...functionalAreasResolvers.Query,
    ...organizationsResolvers.Query,
    ...regulatoryBodiesResolvers.Query,
    ...settingsResolvers.Query,
    ...usersResolvers.Query,
    ...functionalAreasResolvers.Query,
    ...categoriesResolvers.Query,
    ...responsesResolvers.Query,
  },
  Mutation: {
    ...categoriesResolvers.Mutation,
    ...businessUnitsResolvers.Mutation,
    ...functionalAreasResolvers.Mutation,
    ...complianceItemsResolvers.Mutation,
    ...regulatoryBodiesResolvers.Mutation,
  },
};
