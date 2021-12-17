import { IResponse } from "app-interfaces";
import { ComplianceItems, Responses } from "app-models";
import { genMetatags, getStatus, isPermitted } from "app-utils";

const updateQuestions = async (_, { _id }, { authorize }) => {
  try {
    const user = await authorize();

    const response = await Responses.customFindById(_id);
    if (!response) {
      throw new Error("Response doesn't exist");
    }

    if (!isPermitted({ user, action: 'responses.edit', data: { response } })) {
      throw new Error('User is not permitted');
    }

    const complianceItem = await ComplianceItems.customFindById(response.complianceItemId);
    if (!complianceItem) {
      throw new Error("Compliance item assigned to response doesn't exist");
    }

    const newEvidence = [...response.evidence.filter(({ outdated }) => !outdated).map(({ name }) => ({ name }))];
    const newQuestions = [
      ...response.questions
        .filter(({ outdated }) => !outdated)
        .map(({ type, name, description, required }) => ({ type, name, description, required }))
    ];
    const nextStatus = getStatus(complianceItem.frequency || "");
    const updatedResponse: IResponse = {
      ...response,
      attachments: response.attachments,
      status: nextStatus,
      evidence: [
        ...response.evidence.map(evidence => ({
          ...evidence,
          outdated: true,
        })),
        ...newEvidence,
      ],
      questions: [
        ...response.questions.map(question => ({
          ...question,
          outdated: true,
        })),
        ...newQuestions,
      ],
      metatags: {
        ...response.metatags,
        ...genMetatags("updated", user._id),
      },
    };

    await Responses.updateOne({ _id }, updatedResponse);
    return updatedResponse;
  } catch (error: any) {
    throw new Error(error);
  }
}

export default updateQuestions;
