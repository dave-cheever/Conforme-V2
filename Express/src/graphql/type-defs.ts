import { gql } from "apollo-server-express";

import { auditLogsTypeDefs, auditLogsQueryDefs } from './resolvers/auditLogs';
import { auditTypesMutationDefs, auditTypesQueryDefs, auditTypesTypeDefs } from "./resolvers/auditTypes";
import { businessUnitsTypeDefs, businessUnitsQueryDefs, businessUnitsMutationDefs } from "./resolvers/businessUnits";
import { categoriesQueryDefs, categoriesMutationDefs } from "./resolvers/categories";
import { commentsMutationDefs, commentsQueryDefs, commnentsTypeDefs } from "./resolvers/comments";
import { complianceItemsTypeDefs, complianceItemsQueryDefs, complianceItemsMutationDefs } from "./resolvers/complianceItems";
import { graphTypeDefs, graphQueryDefs } from "./resolvers/graph";
import { locationsTypeDefs, locationsQueryDefs, locationsMutationDefs } from "./resolvers/locations";
import { organizationsTypeDefs, organizationsQueryDefs } from "./resolvers/organizations";
import { questionsCategoriesTypeDefs, questionsCategoriesQueryDefs, questionsCategoriesMutationDefs } from "./resolvers/questionsCategories";
import { questionsTypeDefs, questionsQueryDefs, questionsMutationDefs } from "./resolvers/questions";
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
  ${auditTypesTypeDefs}
  ${businessUnitsTypeDefs}
  ${commnentsTypeDefs}
  ${complianceItemsTypeDefs}
  ${graphTypeDefs}
  ${locationsTypeDefs}
  ${organizationsTypeDefs}
  ${questionsTypeDefs}
  ${questionsCategoriesTypeDefs}
  ${responsesTypeDefs}
  ${searchTypeDefs}
  ${settingsTypeDefs}
  ${usersTypeDefs}

  type Query {
    ${auditLogsQueryDefs}
    ${auditTypesQueryDefs}
    ${businessUnitsQueryDefs}
    ${categoriesQueryDefs}
    ${commentsQueryDefs}
    ${complianceItemsQueryDefs}
    ${graphQueryDefs}
    ${locationsQueryDefs}
    ${organizationsQueryDefs}
    ${questionsCategoriesQueryDefs}
    ${questionsQueryDefs}
    ${regulatoryBodiesQueryDefs}
    ${responsesQueryDefs}
    ${searchQueryDefs}
    ${settingsQueryDefs}
    ${usersQueryDefs}
  }
  type Mutation {
    ${auditTypesMutationDefs}
    ${businessUnitsMutationDefs}
    ${categoriesMutationDefs}
    ${commentsMutationDefs}
    ${complianceItemsMutationDefs}
    ${locationsMutationDefs}
    ${questionsCategoriesMutationDefs}
    ${questionsMutationDefs}
    ${regulatoryBodiesMutationDefs}
    ${responsesMutationDefs}
    ${settingsMutationDefs}
    ${usersMutationsDefs}
  }
`;

export default typeDefs;
