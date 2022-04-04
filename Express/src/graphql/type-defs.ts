import { gql } from 'apollo-server-express';

import {
  actionsMutationDefs,
  actionsQueryDefs,
  actionsTypeDefs,
} from './resolvers/actions';
import {
  answersMutationDefs,
  answersQueryDefs,
  answersTypeDefs,
} from './resolvers/answers';
import { auditLogsQueryDefs, auditLogsTypeDefs } from './resolvers/auditLogs';
import {
  auditsMutationDefs,
  auditsQueryDefs,
  auditsTypeDefs,
} from './resolvers/audits';
import {
  auditTypesMutationDefs,
  auditTypesQueryDefs,
  auditTypesTypeDefs,
} from './resolvers/auditTypes';
import {
  businessUnitsMutationDefs,
  businessUnitsQueryDefs,
  businessUnitsTypeDefs,
} from './resolvers/businessUnits';
import {
  categoriesMutationDefs,
  categoriesQueryDefs,
} from './resolvers/categories';
import {
  commentsMutationDefs,
  commentsQueryDefs,
  commnentsTypeDefs,
} from './resolvers/comments';
import {
  complianceItemsMutationDefs,
  complianceItemsQueryDefs,
  complianceItemsTypeDefs,
} from './resolvers/complianceItems';
import { graphQueryDefs, graphTypeDefs } from './resolvers/graph';
import {
  locationsMutationDefs,
  locationsQueryDefs,
  locationsTypeDefs,
} from './resolvers/locations';
import {
  organizationsQueryDefs,
  organizationsTypeDefs,
} from './resolvers/organizations';
import {
  questionsMutationDefs,
  questionsQueryDefs,
  questionsTypeDefs,
} from './resolvers/questions';
import {
  questionsCategoriesMutationDefs,
  questionsCategoriesQueryDefs,
  questionsCategoriesTypeDefs,
} from './resolvers/questionsCategories';
import {
  regulatoryBodiesMutationDefs,
  regulatoryBodiesQueryDefs,
} from './resolvers/regulatoryBodies';
import {
  responsesMutationDefs,
  responsesQueryDefs,
  responsesTypeDefs,
} from './resolvers/responses';
import { searchQueryDefs, searchTypeDefs } from './resolvers/search';
import {
  settingsMutationDefs,
  settingsQueryDefs,
  settingsTypeDefs,
} from './resolvers/settings';
import {
  usersMutationsDefs,
  usersQueryDefs,
  usersTypeDefs,
} from './resolvers/users';

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
  
  ${actionsTypeDefs}
  ${answersTypeDefs}
  ${auditLogsTypeDefs}
  ${auditsTypeDefs}
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
    ${actionsQueryDefs}
    ${answersQueryDefs}
    ${auditLogsQueryDefs}
    ${auditsQueryDefs}
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
    ${actionsMutationDefs}
    ${answersMutationDefs}
    ${auditsMutationDefs}
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
