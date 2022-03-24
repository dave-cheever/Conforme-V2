import { Questions } from "app-models";

const questions = async (_, __, { organization }) => {
  try {
    let questions = await Questions.customFind({}, organization._id);
    return questions.sort((a, b) => a.question.localeCompare(b.question));
  } catch (err: any) {
    throw new Error(err);
  }
};

export default questions;
