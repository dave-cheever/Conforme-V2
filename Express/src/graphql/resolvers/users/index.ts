import session from './session.q';

const usersResolvers = {
  Query: {
    session,
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
`;

export const usersQueryDefs = `
  session: Session!
`;

export default usersResolvers;
