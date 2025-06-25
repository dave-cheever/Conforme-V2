import { IAnswer } from 'app-interfaces';
import { Answers } from 'app-models';
import { GraphService } from 'app-services';
import { checkAnswerPermission } from 'app-utils';

const removeAnswerDocument = async (_, { answerDocumentRemoveInput }, { authorize, organization }) => {
  try {
    const user = await authorize();
    const { _id, documentId } = answerDocumentRemoveInput;

    const answer = await Answers.customFindById(_id, organization._id);
    if (!answer) throw new Error("Answer doesn't exist");

    const isPermitted = checkAnswerPermission({
      user,
      answer,
      organization,
      permissionAction: 'edit',
    });
    if (!isPermitted) throw new Error('User is not permitted to update this answer.');

    const isFileRemoved = await GraphService.deleteDocument(documentId, organization);
    if (!isFileRemoved) throw new Error("Couldn't delete the document");

    const update: Partial<IAnswer> = {};
    update.attachments = answer.attachments?.filter((attachment) => attachment.id !== documentId);

    const updatedAnswer = await Answers.customUpdateOne({ _id }, update, user.userId, organization._id);
    return !!updatedAnswer;
  } catch (error: any) {
    throw new Error(error);
  }
};

export default removeAnswerDocument;
