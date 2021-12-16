import businessUnits from "./businessUnits.q";
import createBusinessUnit from "./createBusinessUnits.m";
import updateBusinessUnit from "./updateBusinessUnits.m";
import deleteBusinessUnit from "./deleteBusinessUnits.m";

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
  type: String!
  region: String!
  imgUrl: String
  ownerId: String
  owner: User
  complianceItemsResponsesCount: Int
  metatags: Metatags!
}

input BusinessUnitInput {
  identifier: String
  name: String!
  type: String!
  region: String!
  ownerId: String!
}

input BusinessUnitModifyInput {
  _id: ID!
  name: String!
  type: String!
  region: String!
  ownerId: String!
}
`;

export const businessUnitsQueryDefs = `
  businessUnits: [BusinessUnit!]!
`;

export const businessUnitsMutationDefs = `
  createBusinessUnit(businessUnitInput: BusinessUnitInput!): BusinessUnit!
  updateBusinessUnit(businessUnitModifyInput: BusinessUnitModifyInput!): BusinessUnit!
  deleteBusinessUnit(_id: String!): Boolean!  
`;

export default businessUnitsResolvers;
