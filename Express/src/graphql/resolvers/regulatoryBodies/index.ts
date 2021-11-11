import createRegulatoryBody from './createRegulatoryBody.m';
import deleteRegulatoryBody from './deleteRegulatoryBody.m';
import regulatoryBodies from './regulatoryBodies.q';
import updateRegulatoryBody from './updateRegulatoryBody.m';

const regulatoryBodiesResolvers = {
  Query: {
    regulatoryBodies,
  },
  Mutation: {
    createRegulatoryBody,
    deleteRegulatoryBody,
    updateRegulatoryBody,
  },
};

export const regulatoryBodiesQueryDefs = `
  regulatoryBodies: [BaseWithName!]!
`;

export const regulatoryBodiesMutationDefs = `
  createRegulatoryBody(name: String!): BaseWithName!
  deleteRegulatoryBody(_id: String!): Boolean!
  updateRegulatoryBody(regulatoryBodyInput: BaseWithNameModifyInput!): BaseWithName!
`;

export default regulatoryBodiesResolvers;
