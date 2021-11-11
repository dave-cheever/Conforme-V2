import createFunctionalArea from "./createFunctionalArea.m";
import deleteFunctionalArea from "./deleteFunctionalArea.m";
import updateFunctionalArea from "./updateFunctionalArea.m";
import functionalAreas from "./functionalAreas.q";

const functionalAreasResolvers = {
  Query: {
    functionalAreas,
  },
  Mutation: {
    createFunctionalArea,
    deleteFunctionalArea,
    updateFunctionalArea,
  },
};

export const functionalAreasQueryDefs = `
  functionalAreas: [BaseWithName!]!
`;

export const functionalAreasMutationDefs = `
  createFunctionalArea(name: String!): BaseWithName!
  deleteFunctionalArea(_id: String!): Boolean!
  updateFunctionalArea(functionalAreaInput: BaseWithNameModifyInput!): BaseWithName!
`;

export default functionalAreasResolvers;
