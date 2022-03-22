import { gql } from "apollo-server-express";

import { auditLogsTypeDefs, auditLogsQueryDefs } from './resolvers/auditLogs';
import { businessUnitsTypeDefs, businessUnitsQueryDefs, businessUnitsMutationDefs } from "./resolvers/businessUnits";
import { categoriesQueryDefs, categoriesMutationDefs } from "./resolvers/categories";
import { commentsMutationDefs, commentsQueryDefs, commnentsTypeDefs } from "./resolvers/comments";
import { complianceItemsTypeDefs, complianceItemsQueryDefs, complianceItemsMutationDefs } from "./resolvers/complianceItems";
import { graphTypeDefs, graphQueryDefs } from "./resolvers/graph";
import { locationsTypeDefs, locationsQueryDefs, locationsMutationDefs } from "./resolvers/locations";
import { organizationsTypeDefs, organizationsQueryDefs } from "./resolvers/organizations";
import { regulatoryBodiesQueryDefs, regulatoryBodiesMutationDefs } from "./resolvers/regulatoryBodies";
import { responsesTypeDefs, responsesQueryDefs, responsesMutationDefs } from "./resolvers/responses";
import { searchQueryDefs, searchTypeDefs } from "./resolvers/search";
import { settingsTypeDefs, settingsQueryDefs, settingsMutationDefs } from "./resolvers/settings";
import { usersTypeDefs, usersQueryDefs,usersMutationsDefs } from "./resolvers/users";

const typeDefs = gql`
  scalar Any
  scalar Date
  scalar Object

  type Metatags {
    addedAt: Date!
    addedBy: ID!
    updatedAt: Date
    updatedBy: ID
    removedAt: Date
    removedBy: ID
  }

  type BaseWithName {
    _id: ID!
    name: String!
    complianceItemsResponsesCount: Int
  }

  input BaseWithNameModifyInput {
    _id: ID!
    name: String
  }
  
  ${auditLogsTypeDefs}
  ${businessUnitsTypeDefs}
  ${commnentsTypeDefs}
  ${complianceItemsTypeDefs}
  ${graphTypeDefs}
  ${locationsTypeDefs}
  ${organizationsTypeDefs}
  ${responsesTypeDefs}
  ${searchTypeDefs}
  ${settingsTypeDefs}
  ${usersTypeDefs}

  type Query {
    ${auditLogsQueryDefs}
    ${businessUnitsQueryDefs}
    ${categoriesQueryDefs}
    ${commentsQueryDefs}
    ${complianceItemsQueryDefs}
    ${graphQueryDefs}
    ${locationsQueryDefs}
    ${organizationsQueryDefs}
    ${regulatoryBodiesQueryDefs}
    ${responsesQueryDefs}
    ${searchQueryDefs}
    ${settingsQueryDefs}
    ${usersQueryDefs}
  }
  type Mutation {
    ${businessUnitsMutationDefs}
    ${categoriesMutationDefs}
    ${commentsMutationDefs}
    ${complianceItemsMutationDefs}
    ${locationsMutationDefs}
    ${regulatoryBodiesMutationDefs}
    ${responsesMutationDefs}
    ${settingsMutationDefs}
    ${usersMutationsDefs}
  }
`;

export default typeDefs;
