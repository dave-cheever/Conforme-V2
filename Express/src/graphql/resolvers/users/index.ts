import searchUsers from './searchUsers.q';
import session from './session.q';
import usersById from './usersById.q';
import users from './users.q';
import updateUser from './updateUser.m';

const usersResolvers = {
  Query: {
    session,
    users,
    searchUsers,
    usersById,
  },
  Mutation: {
    updateUser
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
    lastLogin: Date
    userCreated: Date
  }
  
  type Session {
    user: User!
    sessionExpiration: Date!
  }

  input SearchQuery {
    searchText: String
  }

  input UserQueryInput {
    usersIds: [String!]!
  }

  input UpdateUserModifyInput {
    _id: ID!
    defaultPage: String
  }
`;

export const usersQueryDefs = `
  session: Session!
  users: [User!]!
  searchUsers(searchQuery: SearchQuery): [User!]!
  usersById(userQueryInput: UserQueryInput): [User!]!
`;

export const usersMutationsDefs = `
  updateUser(updateUserModifyInput: UpdateUserModifyInput!): User
`;

export default usersResolvers;
