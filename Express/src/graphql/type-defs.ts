import { gql } from 'apollo-server-express';

const typeDefs = gql`
  scalar Any
  scalar Date
  scalar Object

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
    settings(type: String): [Setting!]!
    roles: String!

    # Regulatory bodies
    regulatoryBodies: [BaseWithName!]!

    # Users
    session: Session!
  }

  # Mutations
  type Mutation {
    # Regulatory bodies
    createRegulatoryBody(name: String!): BaseWithName!
    deleteRegulatoryBody(_id: String!): Boolean!
    updateRegulatoryBody(regulatoryBodyInput: BaseWithNameInput!): BaseWithName!
  }
`;

export default typeDefs;
