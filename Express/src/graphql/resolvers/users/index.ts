import searchUsers from './searchUsers.q';
import session from './session.q';
import usersById from './usersById.q';

const usersResolvers = {
  Query: {
    session,
    searchUsers,
    usersById
  },
  Mutation: {
  },
};

export const usersTypeDefs = `
  type User {
    _id: ID!
    firstName: String
    lastName: String
    displayName: String!
    email: String!
    jobTitle: String
    role: String!
    imgUrl: String
    defaultPage: String!
    organizationsIds: [String!]
    metatags: Metatags!
  }
  
  type Session {
    user: User!
    sessionExpiration: Date!
  }

  input SearchQueryInput {
    searchText: String
  }

  input UserQueryInput {
    usersIds: [String!]!
  }
`;

export const usersQueryDefs = `
  session: Session!
  searchUsers(searchQueryInput: SearchQueryInput): [User!]!
  usersById(userQueryInput: UserQueryInput): [User!]!
`;

export default usersResolvers;
