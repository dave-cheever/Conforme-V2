import { QuestionsCategories } from "app-models";

const questionsCategories = async (_, __, { organization }) => {
  try {
    let questionsCategories = await QuestionsCategories.customFind({}, organization._id);
    return questionsCategories.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err: any) {
    throw new Error(err);
  }
};

export default questionsCategories;