import { QuestionsCategories } from 'app-models';
import { isPermitted } from 'app-utils';

const deleteQuestionsCategory = async (
  _,
  { _id },
  { authorize, organization },
) => {
  try {
    const user = await authorize();

    if (
      !isPermitted({
        user,
        action: 'questionsCategories.delete',
        data: { _id },
      })
    ) 
      throw new Error('User is not permitted');

    const deletedResult = await QuestionsCategories.customDelete(
      { _id },
      user.userId,
      organization._id,
    );
    return deletedResult;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default deleteQuestionsCategory;
