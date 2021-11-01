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

export default regulatoryBodiesResolvers;
