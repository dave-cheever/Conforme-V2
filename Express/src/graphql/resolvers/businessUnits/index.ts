import createBusinessUnit from "./createBusinessUnits.m";
import updateBusinessUnit from "./updateBusinessUnits.m";
import deleteBusinessUnit from "./deleteBusinessUnits.m";

const businessUnitsResolvers = {
  Mutation: {
    createBusinessUnit,
    deleteBusinessUnit,
    updateBusinessUnit,
  },
};

export const businessUnitTypeDef = `
type BusinessUnitPerson {
  firstName: String!
  lastName: String!
  email: String!
  id: String!
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
  imgUrl: String!
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

input BusinessUnitUpdateInput {
  id: ID!
  identifier: String
  name: String
  imgUrl: String
  address: BusinessUnitAddressInput
  ed: BusinessUnitPersonInput
  rd: BusinessUnitPersonInput
  totalResponses: Int
  overdueResponses: Int
}
`

export const businessUnitQueryDef = `
  businessUnits: [BusinessUnits!]!
`

export default businessUnitsResolvers;

