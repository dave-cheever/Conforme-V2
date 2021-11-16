import getGraphUsers from './getGraphUsers.q';
import session from './session.q';

const usersResolvers = {
  Query: {
    session,
    getGraphUsers
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

  input UserQueryInput {
    searchText: String
  }
`;

export const usersQueryDefs = `
  session: Session!
  getGraphUsers(userQueryInput: UserQueryInput): [User!]!
`;

export default usersResolvers;
