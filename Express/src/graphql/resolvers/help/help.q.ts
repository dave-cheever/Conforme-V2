import { Help } from 'app-models';

const help = async () => {
  try {
    const helpData = await Help.customFind();
    return helpData;
  } catch (err) {
    throw new Error('Failed to fetch help documents');
  }
};

export default help;
