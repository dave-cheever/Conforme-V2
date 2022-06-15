import { Actions, Answers } from 'app-models';
import { checkAnswerPermission } from 'app-utils';

const deleteAnswer = async (_, { _id }, { authorize, organization }) => {
  try {
    const user = await authorize();

    const answer = await Answers.customFindById(_id, organization._id);
    const actions = await Actions.customFind({ 'scope.type': 'answer', 'scope._id': _id }, organization._id);
    if (!answer) throw new Error("Answer doesn't exist");

    const isPermitted = checkAnswerPermission({
      user,
      answer,
      organization,
      permissionAction: 'delete',
    });
    if (!isPermitted) throw new Error('User is not permitted to delete this answer.');

    if (actions?.length > 0) {
      await Promise.all(
        actions.map(async (action) => {
          await Actions.customDelete({ _id: action._id }, user._id, organization._id);
        }),
      );
    }

    const deletedResult = await Answers.customDelete({ _id }, user._id, organization._id);

    return deletedResult;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default deleteAnswer;
