import { gql } from "apollo-server-express";
import { businessUnitQueryDef, businessUnitTypeDef } from "./resolvers/businessUnits";
import { responseQueryDef, responseTypeDef } from "./resolvers/responses";
import { settingsQueryDef } from "./resolvers/settings";

const typeDefs = gql`
  scalar Any
  scalar Date
  scalar Object

  ${responseTypeDef}

  ${businessUnitTypeDef}

  type Metatags {
    addedAt: Date!
    addedBy: ID!
    updatedAt: Date
    updatedBy: ID
    removedAt: Date
    removedBy: ID
  }

  type Organization {
    _id: ID!
    name: String!
    licenceExpirationDate: Date!
    logoUrl: String!
    theme: Object!
    addons: Object
  }

  type Session {
    user: User!
    sessionExpiration: Date!
  }

  type Setting {
    _id: ID!
    name: String!
    value: Any!
    label: String!
    type: String!
    description: String!
    options: [String]
    organizationId: String!
  }

  type BaseWithName {
    _id: ID!
    name: String!
    count: Int
  }

  input BaseWithNameInput {
    _id: ID!
    name: String
  }

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

  


  # Queries
  type Query {
    # Organizations
    organization: Organization!

    # Settings
    ${settingsQueryDef}

    # Regulatory bodies
    regulatoryBodies: [BaseWithName!]!

    # Functional Areas
    functionalAreas: [BaseWithName!]!

    # Categories
    categories: [BaseWithName!]!

    #Business Units
    ${businessUnitQueryDef}

    # Users
    session: Session!

    # Responses
    ${responseQueryDef}
  }

  # Mutations
  type Mutation {
    # Regulatory bodies
    createRegulatoryBody(name: String!): BaseWithName!
    deleteRegulatoryBody(_id: String!): Boolean!
    updateRegulatoryBody(regulatoryBodyInput: BaseWithNameInput!): BaseWithName!

    # Functional areas
    createFunctionalArea(name: String!): BaseWithName!
    deleteFunctionalArea(_id: String!): Boolean!
    updateFunctionalArea(functionalAreaInput: BaseWithNameInput!): BaseWithName!

    # Categories
    createCategory(name: String!): BaseWithName!
    deleteCategory(_id: String!): Boolean!
    updateCategory(categoryInput: BaseWithNameInput!): BaseWithName!

    #Business Units
    createBusinessUnit(businessUnitInput: BusinessUnitInput!): BusinessUnits!
    deleteBusinessUnit(_id: String!): Boolean!
    updateBusinessUnit(businessUnitInput: BusinessUnitUpdateInput!): BusinessUnits!
  }
`;

export default typeDefs;
