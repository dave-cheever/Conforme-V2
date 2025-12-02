import getRecentSearches from './getRecentSearches.q';
import saveRecentSearch from './saveRecentSearch.m';
import { GqlEntityTypeEnumDefs } from 'app-enums';

const recentSearchesResolvers = {
  Query: {
    getRecentSearches,
  },
  Mutation: {
    saveRecentSearch,
  },
};

export const recentSearchesTypeDefs = `
  enum EntityType {
    ${GqlEntityTypeEnumDefs}
  }

  type RecentSearch {
    _id: ID!
    userId: String!
    term: String!
    entityId: ID!
    entityType: EntityType!
    organizationId: String!
    metatags: Metatags!
  }

  input GetRecentSearchesInput {
    userId: String!
  }

  input SaveRecentSearchInput {
    userId: String!
    term: String!
    entityId: ID!
    entityType: EntityType!
  }
`;

export const recentSearchesQueryDefs = `
  getRecentSearches(getRecentSearchesInput: GetRecentSearchesInput!): [RecentSearch!]!
`;

export const recentSearchesMutationsDefs = `
  saveRecentSearch(saveRecentSearchInput: SaveRecentSearchInput!): [RecentSearch!]!
`;

export default recentSearchesResolvers;

