import businessUnits from './businessUnits.q';
import createBusinessUnit from './createBusinessUnits.m';
import deleteBusinessUnit from './deleteBusinessUnits.m';
import updateBusinessUnit from './updateBusinessUnits.m';

const businessUnitsResolvers = {
  Query: {
    businessUnits,
  },
  Mutation: {
    createBusinessUnit,
    deleteBusinessUnit,
    updateBusinessUnit,
  },
};

export const businessUnitsTypeDefs = `
  type BusinessUnit {
    _id: ID!
    identifier: String
    name: String!
    scope:Scope!
    imgUrl: String
    ownerId: String
    owner: User
    trackerItemsResponsesCount: Int
    totalAuditsCount: Int
    completedAuditsCount: Int
    upcomingAuditsCount: Int
    missedAuditsCount: Int
    totalActionsCount: Int
    completedActionsCount: Int
    inProgressActionsCount: Int
    overdueActionsCount: Int
    totalAnswersCount: Int
    openAnswersCount: Int
    resolvedAnswersCount: Int
    closedAnswersCount: Int
    metatags: Metatags!
  }

  input BusinessUnitInput {
    identifier: String
    moduleId:ID!
    name: String!
    ownerId: String
  }

  input BusinessUnitModifyInput {
    _id: ID!
    name: String!
    ownerId: String
  }



  input BusinessUnitsAnswersCountInput {
    questionsCategoriesId: ID!
  }
`;

export const businessUnitsQueryDefs = `
  businessUnits(moduleId: ID, businessUnitsAnswersCountInput: BusinessUnitsAnswersCountInput, businessUnitsPagination: PaginationInput): [BusinessUnit!]!
`;

export const businessUnitsMutationDefs = `
  createBusinessUnit(businessUnitInput: BusinessUnitInput!): BusinessUnit!
  updateBusinessUnit(businessUnitModifyInput: BusinessUnitModifyInput!): BusinessUnit!
  deleteBusinessUnit(_id: String!): Boolean!
`;

export default businessUnitsResolvers;
