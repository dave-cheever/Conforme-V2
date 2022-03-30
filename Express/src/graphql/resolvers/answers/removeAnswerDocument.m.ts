import { IAnswer } from 'app-interfaces';
import { Answers } from 'app-models';
import { GraphService } from 'app-services';

const removeAnswerDocument = async (
  _,
  { answerDocumentRemoveInput },
  { authorize, organization }
) => {
  try {
    const user = await authorize();
    const { _id, documentId, documentType } = answerDocumentRemoveInput;

    const response = await Answers.customFindById(_id, organization._id);
    if (!response) throw new Error("Answer doesn't exist");

    const isFileRemoved = await GraphService.deleteDocument(
      documentId,
      organization
    );
    if (!isFileRemoved) throw new Error("Couldn't delete the document");

    const update: Partial<IAnswer> = {};
    if (documentType === 'attachment') {
      update.attachments = response.attachments.filter(
        (attachment) => attachment.id !== documentId
      );
    }

    const updatedAnswer = await Answers.customUpdateOne(
      { _id },
      update,
      user._id,
      organization._id
    );
    return !!updatedAnswer;
  } catch (error: any) {
    throw new Error(error);
  }
};

export default removeAnswerDocument;
