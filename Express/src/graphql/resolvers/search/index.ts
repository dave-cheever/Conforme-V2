import search from './search.q';

const searchResolvers = {
  Query: {
    search,
  },
};

export const searchTypeDefs = `
  type SearchResult {
    _id: ID!
    primaryText: String!
    secondaryText: String
    type: String!
  }

  input SearchQuery {
    searchText: String!
    includeNotPublished: Boolean
  }
`;

export const searchQueryDefs = `
  search(searchQuery: SearchQuery): [SearchResult!]!
`;

export default searchResolvers;
