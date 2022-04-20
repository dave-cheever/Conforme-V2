import { IAnswer } from 'app-interfaces';
import { Answers } from 'app-models';
import { isPermitted } from 'app-utils';

const addAnswerDocuments = async (
  _,
  { answerDocumentsAddInput },
  { authorize, organization },
) => {
  try {
    const user = await authorize();
    const { _id, uploaded } = answerDocumentsAddInput;

    const answer = await Answers.customFindById(_id, organization._id);
    if (!answer) throw new Error("Answer doesn't exist");

    const isUserPermitted = isPermitted({
      user,
      action: 'answers.edit',
      data: { answer },
    });
    if (!isUserPermitted) throw new Error('Access denied');

    const update: Partial<IAnswer> = {
      attachments: answer.attachments,
    };
    uploaded.forEach((document) => update.attachments?.push(document));

    const updatedAnswer = await Answers.customUpdateOne(
      { _id },
      update,
      user._id,
      organization._id,
    );

    return !!updatedAnswer;
  } catch (error: any) {
    throw new Error(error);
  }
};

export default addAnswerDocuments;
