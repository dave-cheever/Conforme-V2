import { QuestionCategories } from "app-models";

const questionCategories = async (_, __, { organization }) => {
  try {
    let questionCategories = await QuestionCategories.customFind({}, organization._id);
    return questionCategories.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err: any) {
    throw new Error(err);
  }
};

export default questionCategories;