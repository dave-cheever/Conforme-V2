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

  type SearchQueryResult {
    audits: [SearchResult!]!
    responses: [SearchResult!]!
  }

  input SearchQuery {
    searchText: String!
    includeNotPublished: Boolean
  }
`;

export const searchQueryDefs = `
  search(searchQuery: SearchQuery): SearchQueryResult!
`;

export default searchResolvers;
