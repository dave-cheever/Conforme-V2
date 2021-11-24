import { Responses } from "app-models";
import { GraphService } from "app-services";
import { genMetatags } from "app-utils";

const removeDocument = async (_, { responseDocumentRemoveInput }, { authorize, organization }) => {
  try {
    const user = await authorize();
    const { _id, documentId, documentType } = responseDocumentRemoveInput;
    const response = await Responses.getById(_id);

    if (!response) {
      throw new Error("Response doesn't exist");
    }

    const isFileRemoved = await GraphService.deleteDocument(documentId, organization);
    if (!isFileRemoved) {
      throw new Error("Couldn't delete the document");
    }
    
    const updatedResponse = {
      ...response,
      metatags: {
        ...response?.metatags,
        ...genMetatags("updated", user._id),
      },
    };

    if (documentType === 'evidence') {
      updatedResponse.evidence = updatedResponse.evidence.map(evidence => {
        if (evidence.uploaded?.id !== documentId) {
          return evidence;
        }
        return {
          name: evidence.name,
        };
      });
    } else if (documentType === 'attachment') {
      updatedResponse.attachments = updatedResponse.attachments.filter(attachment => attachment.id !== documentId);
    }

    await Responses.updateOne({ _id }, updatedResponse);

    return true;
  } catch (error: any) {
    throw new Error(error);
  }
}

export default removeDocument;
