import createCategory from "./createCategories.m";
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

export default categoriesResolvers;
