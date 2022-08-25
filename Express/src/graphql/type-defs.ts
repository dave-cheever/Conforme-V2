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
import { graphQueryDefs, graphTypeDefs } from './resolvers/graph';
import { insightsQueryDefs, insightsTypeDefs } from './resolvers/insights';
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
  trackerItemsMutationDefs,
  trackerItemsQueryDefs,
  trackerItemsTypeDefs,
} from './resolvers/trackerItems';
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
    trackerItemsResponsesCount: Int
  }

  type Document {
    id: String!
    name: String!
    addedAt: Date!
    thumbnail: String
    path: String
  }
  
  type Scope {
    module: String
    moduleId: String
    type: String
    _id: String
  }

  input BaseWithNameModifyInput {
    _id: ID!
    name: String
  }

  input DocumentInput {
    id: String!
    name: String!
    addedAt: Date!
  }
  
  input ScopeInput {
    module: String
    moduleId: String
    type: String
    _id: String
  }

  ${actionsTypeDefs}
  ${answersTypeDefs}
  ${auditLogsTypeDefs}
  ${auditsTypeDefs}
  ${auditTypesTypeDefs}
  ${businessUnitsTypeDefs}
  ${commnentsTypeDefs}
  ${graphTypeDefs}
  ${insightsTypeDefs}
  ${locationsTypeDefs}
  ${organizationsTypeDefs}
  ${questionsTypeDefs}
  ${questionsCategoriesTypeDefs}
  ${responsesTypeDefs}
  ${searchTypeDefs}
  ${settingsTypeDefs}
  ${trackerItemsTypeDefs}
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
    ${graphQueryDefs}
    ${insightsQueryDefs}
    ${locationsQueryDefs}
    ${organizationsQueryDefs}
    ${questionsCategoriesQueryDefs}
    ${questionsQueryDefs}
    ${regulatoryBodiesQueryDefs}
    ${responsesQueryDefs}
    ${searchQueryDefs}
    ${settingsQueryDefs}
    ${trackerItemsQueryDefs}
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
    ${locationsMutationDefs}
    ${questionsCategoriesMutationDefs}
    ${questionsMutationDefs}
    ${regulatoryBodiesMutationDefs}
    ${responsesMutationDefs}
    ${settingsMutationDefs}
    ${trackerItemsMutationDefs}
    ${usersMutationsDefs}
  }
`;

export default typeDefs;
