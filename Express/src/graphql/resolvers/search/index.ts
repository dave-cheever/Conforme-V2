import search from './search.q';

const searchResolvers = {
  Query: {
    search,
  },
};

export const searchTypeDefs = `
  type SearchResult {
    _id: ID!
    title: String!
    type: String!
    user: User
    scope: Scope!
    reference: String
    status: String
    auditTypeName: String
  }

  input SearchQuery {
    searchText: String!
    scopes: [ScopeInput!]!
    moduleId: ID!
  }
`;

export const searchQueryDefs = `
  search(searchQuery: SearchQuery): [SearchResult]!
`;

export default searchResolvers;
