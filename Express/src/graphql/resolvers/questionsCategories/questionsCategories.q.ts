import { FilterQuery } from 'mongoose';

import { IQuestionsCategory } from 'app-interfaces';
import { QuestionsCategories } from 'app-models';

const questionsCategories = async (
  _,
  {
    questionsCategoryQuery = {},
  }: {
    questionsCategoryQuery?: {
      _id?: string;
      _ids?: string[];
    };
  },
  { organization },
) => {
  try {
    const { _id, _ids } = questionsCategoryQuery;
    const selector: FilterQuery<IQuestionsCategory> = {};
    if (_id) selector._id = _id;
    else if (_ids) selector._id = { $in: _ids };

    const questionsCategories = await QuestionsCategories.customFind(
      selector,
      organization._id,
    );
    return questionsCategories.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err: any) {
    throw new Error(err);
  }
};

export default questionsCategories;
