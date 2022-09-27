import searchUsers from './searchUsers.q';
import session from './session.q';
import updateUser from './updateUser.m';
import users from './users.q';
import usersById from './usersById.q';

const usersResolvers = {
  Query: {
    session,
    users,
    searchUsers,
    usersById,
  },
  Mutation: {
    updateUser,
  },
};

export const usersTypeDefs = `
  type User {
    _id: ID!
    firstName: String
    lastName: String
    displayName: String!
    userPrincipalName: String!
    email: String!
    jobTitle: String
    role: String!
    imgUrl: String
    defaultPage: String!
    organizationsIds: [String!]
    metatags: Metatags!
    lastLogin: Date
    userCreated: Date
    responsibleCount: Int
    accountableCount: Int
    contributorCount: Int
    followerCount: Int
    completedAuditsCount: Int
    upcomingAuditsCount: Int
    missedAuditsCount: Int
    totalAuditsCount: Int
    totalActionsCount: Int
    completedActionsCount: Int
    inProgressActionsCount: Int
    overdueActionsCount: Int
    totalAnswersCount: Int
    openAnswersCount: Int
    resolvedAnswersCount: Int
    closedAnswersCount: Int
  }
  
  type Session {
    user: User!
    sessionExpiration: Date!
  }

  input SearchUserQuery {
    searchText: String
  }

  input UserQueryInput {
    usersIds: [String!]!
  }

  input UsersAnswersCountInput {
    questionsCategoriesId: ID!
  }

  input UsersPaginationInput {
    limit: Int
    offset: Int
  }

  input UpdateUserModifyInput {
    _id: ID!
    defaultPage: String
  }
`;

export const usersQueryDefs = `
  session: Session!
  users(usersAnswersCountInput: UsersAnswersCountInput, usersPagination: UsersPaginationInput): [User!]!
  searchUsers(searchQuery: SearchUserQuery): [User!]!
  usersById(userQueryInput: UserQueryInput): [User!]!
`;

export const usersMutationsDefs = `
  updateUser(updateUserModifyInput: UpdateUserModifyInput!): User
`;

export default usersResolvers;
