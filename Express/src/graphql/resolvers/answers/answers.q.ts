import { compareAsc } from 'date-fns';

import { Answers } from 'app-models';

const answers = async (_, { answerQuery }, { organization }) => {
  try {
    const answers = await Answers.customFind({}, organization._id);
    return answers.sort((a, b) =>
      compareAsc(new Date(a?.metatags.addedAt), new Date(b?.metatags.addedAt)),
    );
  } catch (err: any) {
    throw new Error(err);
  }
};

export default answers;
