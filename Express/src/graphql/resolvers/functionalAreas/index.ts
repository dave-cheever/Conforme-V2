import createFunctionalArea from "./createFunctionalArea.m";
import deleteFunctionalArea from "./deleteFunctionalArea.m";
import updateFunctionalArea from "./updateFunctionalAreas.m";
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

export default functionalAreasResolvers;
