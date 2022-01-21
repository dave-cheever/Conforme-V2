import { IResponse } from "app-interfaces";
import { Responses } from "app-models";
import { GraphService } from "app-services";
import { genMetatags } from "app-utils";

const removeDocument = async (_, { responseDocumentRemoveInput }, { authorize, organization }) => {
  try {
    const user = await authorize();
    const { _id, documentId, documentType } = responseDocumentRemoveInput;

    const response = await Responses.customFindById(_id, organization._id);
    if (!response) {
      throw new Error("Response doesn't exist");
    }

    const isFileRemoved = await GraphService.deleteDocument(documentId, organization);
    if (!isFileRemoved) {
      throw new Error("Couldn't delete the document");
    }

    const update: Partial<IResponse> = {};
    if (documentType === 'evidence') {
      update.evidence = response.evidence
        .filter(({ outdated }) => !outdated)
        .map(evidence => {
          if (evidence.uploaded?.id !== documentId) {
            return evidence;
          }
          return {
            name: evidence.name,
          };
        });
        update.evidence = update.evidence.concat(response.evidence.filter(({ outdated }) => outdated));
    } else if (documentType === 'attachment') {
      update.attachments = response.attachments.filter(attachment => attachment.id !== documentId);
    }

    const updatedResponse = await Responses.customUpdateOne({ _id }, update, user._id, organization._id);
    return !!updatedResponse;
  } catch (error: any) {
    throw new Error(error);
  }
}

export default removeDocument;
