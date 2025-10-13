import searchUsers from './searchUsers.q';

import updateUser from './updateUser.m';
import users from './users.q';
import usersById from './usersById.q';
import usersByIdFromDb from './usersByIdFromDb.q';
import saveFilterPreset from './saveFilterPreset.m';
import updateFilterPreset from './updateFilterPreset.m';
import deleteFilterPreset from './deleteFilterPreset.m';
import getFilterPresets from './getFilterPresets.q';

const usersResolvers = {
  Query: {
    users,
    searchUsers,
    usersById,
    usersByIdFromDb,
    getFilterPresets,
  },
  Mutation: {
    updateUser,
    saveFilterPreset,
    updateFilterPreset,
    deleteFilterPreset,
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

  type FilterPresetMetadata {
    modulePath: String!
    fullPath: String!
    usedFilters: [String!]!
  }

  type FilterPreset {
    _id: ID!
    name: String!
    filters: Any!
    moduleId: String!
    moduleType: String!
    pageName: String!
    userId: String!
    metadata: FilterPresetMetadata!
    metatags: Metatags!
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
    filtersPreset: [FilterPreset!]!
  }

  type Session {
    user: User!
    sessionExpiration: Date!
  }

  input SearchUserQuery {
    searchText: String
    organization: String
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

  input FilterPresetMetadataInput {
    modulePath: String!
    fullPath: String!
    usedFilters: [String!]!
  }

  input SaveFilterPresetInput {
    name: String!
    filters: Any!
    moduleId: String!
    moduleType: String!
    pageName: String!
    userId: String!
    metadata: FilterPresetMetadataInput!
  }

  input UpdateFilterPresetInput {
    _id: ID!
    name: String!
    filters: Any!
    moduleId: String!
    moduleType: String!
    pageName: String!
    userId: String!
    metadata: FilterPresetMetadataInput!
  }

  input DeleteFilterPresetInput {
    _id: ID!
    userId: String!
  }

  input GetFilterPresetsInput {
    userId: String!
    moduleId: String
    pageName: String
  }

  type DeleteFilterPresetResponse {
    success: Boolean!
    message: String!
  }

  type Query {
    session: Session!
    users(usersAnswersCountInput: UsersAnswersCountInput, usersPagination: PaginationInput): [User!]!
    searchUsers(searchQuery: SearchUserQuery): [User!]!
    usersById(userQueryInput: UserQueryInput): [User!]!
    usersByIdFromDb(userQueryInput: UserQueryInput): [User!]!
    getFilterPresets(getFilterPresetsInput: GetFilterPresetsInput!): [FilterPreset!]!
  }
`;

export const usersQueryDefs = `
  session: Session!
  users(usersAnswersCountInput: UsersAnswersCountInput, usersPagination: PaginationInput): [User!]!
  searchUsers(searchQuery: SearchUserQuery): [User!]!
  usersById(userQueryInput: UserQueryInput): [User!]!
  usersByIdFromDb(userQueryInput: UserQueryInput): [User!]!
  getFilterPresets(getFilterPresetsInput: GetFilterPresetsInput!): [FilterPreset!]!
`;

export const usersMutationsDefs = `
  updateUser(updateUserModifyInput: UpdateUserModifyInput!): User
  saveFilterPreset(saveFilterPresetInput: SaveFilterPresetInput!): FilterPreset
  updateFilterPreset(updateFilterPresetInput: UpdateFilterPresetInput!): FilterPreset
  deleteFilterPreset(deleteFilterPresetInput: DeleteFilterPresetInput!): DeleteFilterPresetResponse
`;

export default usersResolvers;
