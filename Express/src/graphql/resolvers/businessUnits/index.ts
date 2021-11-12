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
type BusinessUnitPerson {
  firstName: String!
  lastName: String!
  email: String!
  _id: String!
}

type BusinessUnitIdentifier {
  system: String!
  value: String!
}

type BusinessUnitAddress {
  lineOne: String!
  city: String!
  county: String!
  postcode: String!
  country: String!
}

type BusinessCommunications {
  type: String!
  value: String!
}

input BusinessUnitPersonInput {
  firstName: String
  lastName: String
  email: String
  id: String!
}

input BusinessUnitAddressInput {
  lineOne: String
  city: String
  county: String
  postcode: String
  country: String
}

type BusinessUnits {
  _id: ID!
  identifier: String!
  name: String!
  type: String!
  region: String!
  identifiers:[BusinessUnitIdentifier!]
  imgUrl: String
  communications:[BusinessCommunications!]
  address: BusinessUnitAddress!
  ed: BusinessUnitPerson!
  rd: BusinessUnitPerson!
  totalResponses: Int!
  overdueResponses: Int!
  metatags: Metatags!
}

input BusinessUnitInput {
  identifier: String
  name: String
  imgUrl: String
  address: BusinessUnitAddressInput
  ed: BusinessUnitPersonInput
  rd: BusinessUnitPersonInput
  totalResponses: Int
  overdueResponses: Int
}

input BusinessUnitModifyInput {
  _id: ID!
  identifier: String
  name: String
  imgUrl: String
  address: BusinessUnitAddressInput
  ed: BusinessUnitPersonInput
  rd: BusinessUnitPersonInput
  totalResponses: Int
  overdueResponses: Int
}
`;

export const businessUnitsQueryDefs = `
  businessUnits: [BusinessUnits!]!
`;

export const businessUnitsMutationDefs = `
  createBusinessUnit(businessUnitInput: BusinessUnitInput!): BusinessUnits!
  updateBusinessUnit(businessUnitModifyInput: BusinessUnitModifyInput!): BusinessUnits!
  deleteBusinessUnit(_id: String!): Boolean!
`;

export default businessUnitsResolvers;

