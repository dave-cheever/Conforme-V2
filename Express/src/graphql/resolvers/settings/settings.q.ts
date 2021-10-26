import { Settings } from "app-models";

const settings = async (_, { type }) => {
  try {
    const settings = await Settings.getByType(type);
    return settings;
  } catch (err) {
    throw new Error(err);
  }
};

export default settings;
