import searchUsers from './searchUsers.q';

import updateUser from './updateUser.m';
import users from './users.q';
import usersById from './usersById.q';
import usersByIdFromDb from './usersByIdFromDb.q';

const usersResolvers = {
  Query: {
    users,
    searchUsers,
    usersById,
    usersByIdFromDb,
  },
  Mutation: {
    updateUser,
  },
  User: {
    defaultPage: (user) => {
      return Array.isArray(user.defaultPage) ? user.defaultPage : [];
    },
  },
};

export const usersTypeDefs = `
 type DefaultPage {
    name: String
    path: String
  }

  type User {
    _id: ID!
    userId: String!
    firstName: String
    lastName: String
    displayName: String!
    userPrincipalName: String!
    email: String!
    jobTitle: String
    role: String!
    imgUrl: String
    defaultPage: [DefaultPage]
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

  input  DefaultPageInput {
    name: String
    path: String
  }

  input UpdateUserModifyInput {
    _id: ID!
    defaultPage: [DefaultPageInput]
  }

  type Query {
    session: Session!
    users(usersAnswersCountInput: UsersAnswersCountInput, usersPagination: PaginationInput): [User!]!
    searchUsers(searchQuery: SearchUserQuery): [User!]!
    usersById(userQueryInput: UserQueryInput): [User!]!
    usersByIdFromDb(userQueryInput: UserQueryInput): [User!]!
  }
`;

export const usersQueryDefs = `
  session: Session!
  users(usersAnswersCountInput: UsersAnswersCountInput, usersPagination: PaginationInput): [User!]!
  searchUsers(searchQuery: SearchUserQuery): [User!]!
  usersById(userQueryInput: UserQueryInput): [User!]!
  usersByIdFromDb(userQueryInput: UserQueryInput): [User!]!
`;

export const usersMutationsDefs = `
  updateUser(updateUserModifyInput: UpdateUserModifyInput!): User
`;

export default usersResolvers;
