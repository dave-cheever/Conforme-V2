import auditLogsResolvers from "./auditLogs";
import businessUnitsResolvers from "./businessUnits"
import categoriesResolvers from "./categories";
import commentsResolvers from "./comments";
import complianceItemsResolvers from "./complianceItems";
import graphResolvers from "./graph";
import locationsResolvers from "./locations";
import organizationsResolvers from "./organizations";
import regulatoryBodiesResolvers from "./regulatoryBodies";
import responsesResolvers from "./responses";
import scalars from "../scalars";
import searchResolvers from "./search";
import settingsResolvers from "./settings";
import usersResolvers from "./users";

export default {
  Any: scalars.anyScalar,
  Date: scalars.dateScalar,
  Query: {
    ...auditLogsResolvers.Query,
    ...businessUnitsResolvers.Query,
    ...categoriesResolvers.Query,
    ...commentsResolvers.Query,
    ...complianceItemsResolvers.Query,
    ...graphResolvers.Query,
    ...locationsResolvers.Query,
    ...organizationsResolvers.Query,
    ...regulatoryBodiesResolvers.Query,
    ...responsesResolvers.Query,
    ...searchResolvers.Query,
    ...settingsResolvers.Query,
    ...usersResolvers.Query,
  },
  Mutation: {
    ...businessUnitsResolvers.Mutation,
    ...categoriesResolvers.Mutation,
    ...commentsResolvers.Mutation,
    ...complianceItemsResolvers.Mutation,
    ...locationsResolvers.Mutation,
    ...regulatoryBodiesResolvers.Mutation,
    ...responsesResolvers.Mutation,
    ...settingsResolvers.Mutation,
    ...usersResolvers.Mutation
  },
};
