import { IAnswer } from 'app-interfaces';
import { Answers, Audits } from 'app-models';
import { isPermitted } from 'app-utils';

const createAnswer = async (
  _,
  { answer, auditId },
  { authorize, organization }
) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: 'answers.add' }))
      throw new Error('User is not permitted');

    const createdAnswer = await Answers.customCreate(
      answer,
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
        answersIds: [
          ...parentAudit.answersIds,
          (createdAnswer as unknown as IAnswer & { _id: string })._id
        ]
      },
      user._id,
      organization._id
    );

    return createdAnswer;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default createAnswer;
