import { gql } from "apollo-server-express";

import { businessUnitsTypeDefs, businessUnitsQueryDefs, businessUnitsMutationDefs } from "./resolvers/businessUnits";
import { categoriesQueryDefs, categoriesMutationDefs } from "./resolvers/categories";
import { complianceItemsTypeDefs, complianceItemsQueryDefs, complianceItemsMutationDefs } from "./resolvers/complianceItems";
import { functionalAreasQueryDefs, functionalAreasMutationDefs } from "./resolvers/functionalAreas";
import { organizationsTypeDefs, organizationsQueryDefs } from "./resolvers/organizations";
import { regulatoryBodiesQueryDefs, regulatoryBodiesMutationDefs } from "./resolvers/regulatoryBodies";
import { responsesTypeDefs, responsesQueryDefs } from "./resolvers/responses";
import { settingsTypeDefs, settingsQueryDefs } from "./resolvers/settings";
import { usersTypeDefs, usersQueryDefs } from "./resolvers/users";

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
    count: Int
  }

  input BaseWithNameModifyInput {
    _id: ID!
    name: String
  }
  
  ${businessUnitsTypeDefs}
  ${complianceItemsTypeDefs}
  ${organizationsTypeDefs}
  ${responsesTypeDefs}
  ${settingsTypeDefs}
  ${usersTypeDefs}

  type Query {
    ${businessUnitsQueryDefs}
    ${categoriesQueryDefs}
    ${complianceItemsQueryDefs}
    ${functionalAreasQueryDefs}
    ${organizationsQueryDefs}
    ${regulatoryBodiesQueryDefs}
    ${responsesQueryDefs}
    ${settingsQueryDefs}
    ${usersQueryDefs}
  }
  type Mutation {
    ${businessUnitsMutationDefs}
    ${categoriesMutationDefs}
    ${complianceItemsMutationDefs}
    ${functionalAreasMutationDefs}
    ${regulatoryBodiesMutationDefs}
  }
`;

export default typeDefs;
