import { IResponse } from 'app-interfaces';
import { Responses } from 'app-models';
import { isPermitted } from 'app-utils';

const addDocuments = async (
  _,
  { responseDocumentsAddInput },
  { authorize, organization },
) => {
  try {
    const user = await authorize();
    const { _id, documentType, documentName, uploaded } =
      responseDocumentsAddInput;

    if (documentType === 'evidence' && !documentName)
      throw new Error('Document name is required');

    const response = await Responses.customFindById(_id, organization._id);
    if (!response) throw new Error("Response doesn't exist");

    const isUserPermitted = isPermitted({
      user,
      action: 'responses.edit',
      data: { response },
    });
    if (!isUserPermitted) throw new Error('Access denied');

    const update: Partial<IResponse> = {
      evidence: response.evidence,
      attachments: response.attachments,
    };
    if (documentType === 'evidence') {
      const evidence = update.evidence?.find(
        (evidence) => evidence.name === documentName,
      );
      if (!evidence) throw new Error("Evidence doesn't exist");

      evidence.uploaded = uploaded[0];
    } else if (documentType === 'attachment')
      uploaded.forEach((document) => update.attachments?.push(document));

    const updatedResponse = await Responses.customUpdateOne(
      { _id },
      update,
      user.userId,
      organization._id,
    );
    return !!updatedResponse;
  } catch (error: any) {
    throw new Error(error);
  }
};

export default addDocuments;
