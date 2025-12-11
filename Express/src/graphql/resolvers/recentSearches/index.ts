import getRecentSearches from './getRecentSearches.q';
import saveRecentSearch from './saveRecentSearch.m';

const recentSearchesResolvers = {
  Query: {
    getRecentSearches,
  },
  Mutation: {
    saveRecentSearch,
  },
};

export const recentSearchesTypeDefs = `
  type RecentSearch {
    _id: ID!
    userId: String!
    text: String!
    organizationId: String!
    metatags: Metatags!
  }

  input GetRecentSearchesInput {
    userId: String!
  }

  input SaveRecentSearchInput {
    userId: String!
    text: String!
  }
`;

export const recentSearchesQueryDefs = `
  getRecentSearches(getRecentSearchesInput: GetRecentSearchesInput!): [RecentSearch!]!
`;

export const recentSearchesMutationsDefs = `
  saveRecentSearch(saveRecentSearchInput: SaveRecentSearchInput!): [RecentSearch!]!
`;

export default recentSearchesResolvers;

