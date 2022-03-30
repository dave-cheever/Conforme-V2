import { Answers, Audits } from 'app-models';
import { isPermitted } from 'app-utils';

const deleteAnswer = async (
  _,
  { _id, auditId },
  { authorize, organization }
) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: 'answers.delete', data: { _id } }))
      throw new Error('User is not permitted');

    const deletedResult = await Answers.customDelete(
      { _id },
      user._id,
      organization._id
    );
    const parentAudit = await Audits.customFindOne(
      { _id: auditId },
      organization._id
    );
    await Audits.customUpdateOne(
      { _id: parentAudit._id },
      {
        answersIds: parentAudit.answersIds.filter((id) => id !== _id)
      },
      user._id,
      organization._id
    );

    return deletedResult;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default deleteAnswer;
