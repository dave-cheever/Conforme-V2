import { compareAsc } from 'date-fns';

import { Audits } from 'app-models';

const audits = async (_, __, { organization }) => {
  try {
    const audits = await Audits.customFind({}, organization._id);
    return audits.sort((a, b) =>
      compareAsc(new Date(a.metatags.addedAt), new Date(b.metatags.addedAt)),
    );
  } catch (err: any) {
    throw new Error(err);
  }
};

export default audits;
