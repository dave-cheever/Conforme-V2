import categories from './categories.q';
import createCategory from './createCategory.m';
import deleteCategory from './deleteCategory.m';
import updateCategory from './updateCategory.m';

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
  categories(moduleId: ID): [BaseWithName!]!
`;

export const categoriesMutationDefs = `
  createCategory(name: String!, moduleId: ID): BaseWithName!
  updateCategory(categoryInput: BaseWithNameModifyInput!): BaseWithName!
  deleteCategory(_id: String!): Boolean!
`;

export default categoriesResolvers;
