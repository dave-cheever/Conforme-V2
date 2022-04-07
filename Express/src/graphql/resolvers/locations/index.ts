import createLocation from './createLocations.m';
import deleteLocation from './deleteLocations.m';
import locations from './locations.q';
import updateLocation from './updateLocations.m';

const locationsResolvers = {
  Query: {
    locations,
  },
  Mutation: {
    createLocation,
    updateLocation,
    deleteLocation,
  },
};

export const locationsTypeDefs = `
  type Location {
    _id: ID!
    name: String!
    ownerId: String!
    organizationId: String
    notes: String!
    complianceItemsResponsesCount: Int
    owner: User
    metatags: Metatags!
  }

  input LocationInput {
    name: String!
    ownerId: String!
    notes: String!
  }

  input LocationModifyInput {
    _id: ID!
    name: String!
    ownerId: String! 
    notes: String!
  }

  input LocationQueryInput {
    _id: ID!
  }
`;

export const locationsQueryDefs = `
  locations(locationQueryInput: LocationQueryInput): [Location!]!
`;

export const locationsMutationDefs = `
  createLocation(locationInput: LocationInput!): Location!
  updateLocation(locationModifyInput: LocationModifyInput!): Location!
  deleteLocation(_id: String!): Boolean!  
`;

export default locationsResolvers;
