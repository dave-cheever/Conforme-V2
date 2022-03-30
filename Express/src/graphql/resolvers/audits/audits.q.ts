import { Audits } from 'app-models';

const audits = async (_, __, { organization }) => {
  try {
    const audits = await Audits.customFind({}, organization._id);
    return audits.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err: any) {
    throw new Error(err);
  }
};

export default audits;
