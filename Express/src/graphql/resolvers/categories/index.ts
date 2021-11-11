import createCategory from "./createCategory.m";
import deleteCategory from "./deleteCategory.m";
import updateCategory from "./updateCategory.m";
import categories from "./categories.q";

const categoriesResolvers = {
  Query: {
    categories,
  },
  Mutation: {
    createCategory,
    deleteCategory,
    updateCategory,
  },
};

export const categoriesQueryDefs = `
  categories: [BaseWithName!]!
`;

export const categoriesMutationDefs = `
  createCategory(name: String!): BaseWithName!
  deleteCategory(_id: String!): Boolean!
  updateCategory(categoryInput: BaseWithNameModifyInput!): BaseWithName!
`;

export default categoriesResolvers;
