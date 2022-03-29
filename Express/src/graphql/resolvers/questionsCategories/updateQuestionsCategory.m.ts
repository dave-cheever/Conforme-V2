import { QuestionsCategories } from 'app-models';
import { isPermitted } from 'app-utils';

const updateQuestionsCategory = async (
  _,
  { questionsCategoryInput },
  { authorize, organization },
) => {
  try {
    const user = await authorize();

    if (
      !isPermitted({
        user,
        action: 'questionsCategories.edit',
        data: questionsCategoryInput,
      })
    ) 
      throw new Error('User is not permitted');

    const questionsCategory = await QuestionsCategories.customFindById(
      questionsCategoryInput._id,
      organization._id,
    );
    if (!questionsCategory) 
      throw new Error("Question Category doesn't exist");

    const updatedQuestionsCategory = await QuestionsCategories.customUpdateOne(
      { _id: questionsCategory._id },
      questionsCategoryInput,
      user._id,
      organization._id,
    );
    return updatedQuestionsCategory;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default updateQuestionsCategory;
